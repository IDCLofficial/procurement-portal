import { ConflictException, Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './entities/user.schema';
import TokenHandlers from 'src/lib/generateToken';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenHandlers: TokenHandlers,
    private emailService: EmailService,
  ) {}

  /**
   * Create a new user account
   * 
   * @param createUserDto - User registration data
   * @returns Created user object (without password)
   * @throws {ConflictException} If user with email already exists
   * 
   * @description
   * - Validates email uniqueness
   * - Hashes password with bcrypt (salt rounds: 10)
   * - Creates user with active status by default
   * - Returns user object without password field
   */
  async create(createUserDto: CreateUserDto, userId:string, token:string): Promise<Omit<User, 'password'>> {
    const admin = await this.userModel.findById(userId);
    
    if(!admin || token !== admin.accessToken){
      throw new UnauthorizedException('Unauthorized')
    }
    
    // Check if user with email already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if(existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if(createUserDto.role === "Registrar"){
      const findRegistrar = await this.userModel.findOne({
        role: "Registrar"
      })
      if(findRegistrar){
        throw new BadRequestException("Cannot create more than one Registrars.")
      }
    }

    if(createUserDto.role === "Auditor"){
      const auditor = await this.userModel.findOne({
        role:"Auditor"
      })
      if(auditor){
        throw new BadRequestException("Cannot create more than one Auditor.")
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create the new user
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      assignedApps: 0,
    });

    await user.save();

    try {
      await this.emailService.sendUserCredentialsEmail(
        createUserDto.email,
        createUserDto.fullName,
        createUserDto.password,
      );
    } catch (err) {
      // Intentionally do not fail user creation if email sending fails
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  /**
   * Authenticate user login
   * 
   * @param loginUserDto - User login credentials (email and password)
   * @returns User object (without password) and JWT authentication token
   * @throws {NotFoundException} If user not found
   * @throws {UnauthorizedException} If account is inactive
   * @throws {BadRequestException} If password is invalid
   * 
   * @description
   * - Validates user existence by email
   * - Checks if account is active
   * - Compares provided password with hashed password
   * - Updates lastLogin timestamp
   * - Generates JWT token for authentication
   * - Returns user data without password field
   */
  async login(loginUserDto: LoginUserDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Find user by email
    const user = await this.userModel.findOne({ email: loginUserDto.email }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    // Return user without password and generate token
    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = this.tokenHandlers.generateToken(userWithoutPassword);
    user.accessToken = token;
    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Get all users by name, excluding Admin role
   * 
   * @returns Array of users sorted by fullName (without password field)
   * 
   * @description
   * - Retrieves all users except those with Admin role
   * - Sorts users alphabetically by fullName
   * - Excludes password field from response
   * - Returns empty array if no users found
   */
  async getUsersByName(token:string, userId:string): Promise<Omit<User, 'password'>[]> {
    
    const admin = await this.userModel.findById(userId);
    
    if(!admin || token !== admin.accessToken){
      throw new UnauthorizedException('Unauthorized')
    }

    const users = await this.userModel
      .find({ role: { $ne: 'Admin' } })
      .select('-password')
      .sort({ fullName: 1, createdAt:-1 })
      .exec();

    return users.map(user => ({
      id:user._id,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      phoneNo: user.phoneNo,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      assignedApps: user.assignedApps,
      mda: user.mda
    }));
  }

  async getDeskOfficersByMda(
    mda:string
  ): Promise<any>{
    const deskOfficers = await this.userModel
    .find({
      role:'Desk officer',
      mda:decodeURIComponent(mda)
    })
    .sort({createdAt: -1})
    .exec()

    if(!deskOfficers){
      return []
    }

    return deskOfficers.map(user => ({
      id:user._id,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      phoneNo: user.phoneNo,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      assignedApps: user.assignedApps,
      mda: user.mda
    }));

  }

  /**
   * Edit user information (name and/or role only)
   * 
   * @param id - User ID to update
   * @param editUserDto - User data to update (fullName and/or role)
   * @returns Updated user object (without password)
   * @throws {NotFoundException} If user not found
   * @throws {BadRequestException} If attempting to change a Registrar role when another Registrar exists
   * 
   * @description
   * - Validates user existence
   * - Only allows updating fullName and role fields
   * - Ensures only one Registrar exists in the system
   * - Returns updated user data without password
   */
  async editUser(id: string, editUserDto: EditUserDto, token:string, userId:string): Promise<Omit<User, 'password'>> {
    const admin = await this.userModel.findById(userId);
    
    if(!admin || token !== admin.accessToken){
      throw new UnauthorizedException('Unauthorized')
    }
      
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If changing role to Registrar, check if another Registrar already exists
    if (editUserDto.role === 'Registrar' && user.role !== 'Registrar') {
      const existingRegistrar = await this.userModel.findOne({
        role: 'Registrar',
        _id: { $ne: id }
      }).exec();

      if (existingRegistrar) {
        throw new BadRequestException('Cannot create more than one Registrar.');
      }
    }

    // Update only the provided fields
    if (editUserDto.fullName !== undefined) {
      user.fullName = editUserDto.fullName;
    }
    if (editUserDto.role !== undefined) {
      user.role = editUserDto.role;
    }
    if(editUserDto.mda !== undefined){
      user.mda = editUserDto.mda;
    }

    await user.save();

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  /**
   * Delete a user by ID (Admin only)
   * 
   * @param id - User ID to delete
   * @returns Deleted user object (without password)
   * @throws {NotFoundException} If user not found
   * @throws {BadRequestException} If attempting to delete an Admin user
   * 
   * @description
   * - Validates user existence
   * - Prevents deletion of Admin users
   * - Permanently removes user from database
   * - Returns deleted user data without password
   */
  async remove(id: string, token:string, userId:string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(id).exec();

    const admin = await this.userModel.findById(userId);
    
    if(!admin || token !== admin.accessToken){
      throw new UnauthorizedException('Unauthorized')
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent deletion of Admin users
    if (user.role === 'Admin') {
      throw new BadRequestException('Cannot delete Admin users');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Return deleted user without password
    const { password: _, ...userWithoutPassword } = deletedUser.toObject();
    return userWithoutPassword;
  }

  /**
   * Get all users with counts by role and status
   * 
   * @returns Object containing users array and count statistics
   * 
   * @description
   * Retrieves all users with the following statistics:
   * - Total count of all users
   * - Count of Desk Officer role users
   * - Count of Active users
   * - Count of Inactive users
   */
  async getAllUsersWithCounts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    deskOfficerCount: number;
    activeCount: number;
    inactiveCount: number;
    users: Omit<User, 'password'>[];
  }> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const [users, total, deskOfficerCount, activeCount, inactiveCount] = await Promise.all([
      this.userModel
        .find()
        .select('-password')
        .sort({ fullName: 1 })
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      this.userModel.countDocuments({}).exec(),
      this.userModel.countDocuments({ role: 'Desk officer' }).exec(),
      this.userModel.countDocuments({ isActive: true }).exec(),
      this.userModel.countDocuments({ isActive: false }).exec(),
    ]);

    return {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      deskOfficerCount,
      activeCount,
      inactiveCount,
      users: users.map(user => user.toObject()),
    };
  }
}
