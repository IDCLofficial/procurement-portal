import { ConflictException, Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './entities/user.schema';
import TokenHandlers from 'src/lib/generateToken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenHandlers: TokenHandlers,
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
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user with email already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
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

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Return user without password and generate token
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return {
      user: userWithoutPassword,
      token: this.tokenHandlers.generateToken(userWithoutPassword),
    };
  }
}
