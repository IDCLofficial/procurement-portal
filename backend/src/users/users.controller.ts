import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Role } from './entities/user.schema';
import { AdminGuard } from '../guards/admin.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create a new user account
   * 
   * @param createUserDto - User registration data including full name, email, phone, role, and password
   * @returns Created user object with all fields except password
   * @throws {ConflictException} 409 - If user with email already exists
   * @throws {BadRequestException} 400 - If validation fails
   * 
   * @description
   * Creates a new user account in the system with the following features:
   * - Validates all input fields (email format, password strength, role enum)
   * - Checks for duplicate email addresses
   * - Hashes password securely using bcrypt
   * - Sets default values for isActive (true) and assignedApps (0)
   * - Returns user data without exposing the password
   * 
   * @example
   * POST /users
   * {
   *   "fullName": "John Doe",
   *   "email": "john.doe@education.gov",
   *   "phoneNo": "+2348012345678",
   *   "role": "Desk officer",
   *   "password": "SecurePass123!"
   * }
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user account with the specified role (Desk officer, Auditor, or Registrar). Password is hashed before storage.'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration details',
    examples: {
      deskOfficer: {
        summary: 'Desk Officer',
        value: {
          fullName: 'John Doe',
          email: 'john.doe@education.gov',
          phoneNo: '+2348012345678',
          role: Role.DESK_OFFICER,
          password: 'SecurePass123!'
        }
      },
      auditor: {
        summary: 'Auditor',
        value: {
          fullName: 'Jane Smith',
          email: 'jane.smith@education.gov',
          phoneNo: '+2348087654321',
          role: Role.AUDITOR,
          password: 'AuditorPass456!'
        }
      },
      registrar: {
        summary: 'Registrar',
        value: {
          fullName: 'Michael Johnson',
          email: 'michael.johnson@education.gov',
          phoneNo: '+2348098765432',
          role: Role.REGISTRAR,
          password: 'RegistrarPass789!'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        fullName: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john.doe@education.gov' },
        phoneNo: { type: 'string', example: '+2348012345678' },
        role: { type: 'string', enum: ['Desk officer', 'Auditor', 'Registrar'], example: 'Desk officer' },
        isActive: { type: 'boolean', example: true },
        assignedApps: { type: 'number', example: 0 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'User with this email already exists' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['Email is required', 'Password must be at least 8 characters long']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  create(@Body() createUserDto: CreateUserDto, @Req() req:any) {
    const token = req.headers.authorization.split(' ')[1];
    try{
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if(!decoded._id || decoded.role !== 'Admin'){
        throw new UnauthorizedException('Unauthorized')
      }
      return this.usersService.create(createUserDto);
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }

  /**
   * Get all users sorted by name (excluding Admin role)
   * 
   * @returns Array of users sorted alphabetically by fullName
   * 
   * @description
   * Retrieves all users except those with Admin role, sorted by name.
   * Passwords are excluded from the response.
   */
  @Get('usersByName')
  @ApiOperation({ 
    summary: 'Get all users by name',
    description: 'Retrieves all users sorted alphabetically by name, excluding Admin role users'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          fullName: { type: 'string' },
          email: { type: 'string' },
          phoneNo: { type: 'string' },
          role: { type: 'string', enum: ['Desk officer', 'Auditor', 'Registrar'] },
          isActive: { type: 'boolean' },
          assignedApps: { type: 'number' },
          lastLogin: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  getUsersByName(@Req() req:any){
    if(!req.headers.authorization){
      throw new UnauthorizedException('Unauthorized')
    }
    const token = req.headers.authorization.split(' ')[1];
    try{
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if(!decoded._id || decoded.role !== 'Admin'){
        throw new UnauthorizedException('Unauthorized')
      }
      return this.usersService.getUsersByName();
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }
  /**
   * User login authentication
   * 
   * @param loginUserDto - User login credentials (email and password)
   * @returns User object (without password) and JWT authentication token
   * @throws {NotFoundException} 404 - If user not found
   * @throws {UnauthorizedException} 401 - If account is inactive
   * @throws {BadRequestException} 400 - If password is invalid
   * 
   * @description
   * Authenticates a user and provides a JWT token for subsequent requests:
   * - Validates user credentials (email and password)
   * - Checks if the account is active
   * - Verifies password against hashed version in database
   * - Updates lastLogin timestamp
   * - Generates and returns JWT token
   * - Returns user data without exposing the password
   * 
   * @example
   * POST /users/login
   * {
   *   "email": "john.doe@education.gov",
   *   "password": "SecurePass123!"
   * }
   */
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user with email and password, returns user data and JWT token for authorization.'
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'User login credentials',
    examples: {
      deskOfficer: {
        summary: 'Desk Officer Login',
        value: {
          email: 'john.doe@education.gov',
          password: 'SecurePass123!'
        }
      },
      auditor: {
        summary: 'Auditor Login',
        value: {
          email: 'jane.smith@education.gov',
          password: 'AuditorPass456!'
        }
      },
      registrar: {
        summary: 'Registrar Login',
        value: {
          email: 'michael.johnson@education.gov',
          password: 'RegistrarPass789!'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@education.gov' },
            phoneNo: { type: 'string', example: '+2348012345678' },
            role: { type: 'string', enum: ['Desk officer', 'Auditor', 'Registrar'], example: 'Desk officer' },
            isActive: { type: 'boolean', example: true },
            assignedApps: { type: 'number', example: 5 },
            lastLogin: { type: 'string', format: 'date-time', example: '2025-11-19T13:37:00.000Z' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        token: { 
          type: 'string', 
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJlbWFpbCI6ImpvaG4uZG9lQGVkdWNhdGlvbi5nb3YiLCJpYXQiOjE2MzI5MjQ4MDAsImV4cCI6MTYzMjkyODQwMH0.abc123xyz',
          description: 'JWT token for authentication. Include in Authorization header as "Bearer {token}"'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Account is inactive',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Account is inactive. Please contact administrator.' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid password',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid password' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  /**
   * Delete a user account (Admin only)
   * 
   * @param id - User ID (MongoDB ObjectId) to delete
   * @returns Deleted user object (without password)
   * @throws {UnauthorizedException} 401 - If token is missing or invalid
   * @throws {ForbiddenException} 403 - If user is not an Admin
   * @throws {NotFoundException} 404 - If user not found
   * @throws {BadRequestException} 400 - If attempting to delete an Admin user
   * 
   * @description
   * Deletes a user account from the system. Only users with Admin role can perform this action.
   * The endpoint:
   * - Validates the JWT token from Authorization header
   * - Verifies the requesting user has Admin role
   * - Prevents deletion of Admin users
   * - Permanently removes the user from the database
   * - Returns the deleted user data (without password)
   * 
   * @example
   * DELETE /users/507f1f77bcf86cd799439011
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user (Admin only)',
    description: 'Permanently deletes a user account. Only accessible by users with Admin role. Cannot delete Admin users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        fullName: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john.doe@education.gov' },
        phoneNo: { type: 'string', example: '+2348012345678' },
        role: { type: 'string', enum: ['Desk officer', 'Auditor', 'Registrar'], example: 'Desk officer' },
        isActive: { type: 'boolean', example: true },
        assignedApps: { type: 'number', example: 5 },
        lastLogin: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Missing or invalid token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Authorization header missing' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Admin role required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Access denied. Admin role required.' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User with ID 507f1f77bcf86cd799439011 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete Admin users',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Cannot delete Admin users' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  remove(@Param('id') id: string, @Req() req:any) {
    const token = req.headers.authorization.split(' ')[1];
    try{
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if(!decoded._id || decoded.role !== 'Admin'){
        throw new UnauthorizedException('Unauthorized')
      }
      return this.usersService.remove(id);
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }
}
