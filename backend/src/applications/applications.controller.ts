import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { AssignApplicationDto } from './dto/assign-application.dto';
import { ApplicationStatus, ApplicationType, CurrentStatus } from './entities/application.schema';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Get all applications with optional filtering and pagination
   * 
   * @description
   * Retrieves all applications from the system with optional filtering by status.
   * Supports pagination to handle large datasets efficiently.
   * Returns paginated results with metadata including total count and page information.
   * 
   * @param status - Optional filter by application status (PENDING, APPROVED, REJECTED)
   * @param page - Page number for pagination (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Paginated list of applications with metadata
   * 
   * @throws {BadRequestException} If invalid status value or failed to retrieve applications
   * 
   * @example
   * GET /applications?status=PENDING&page=1&limit=10
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all applications',
    description: 'Retrieves all applications with optional filtering by status and pagination. Returns paginated results with metadata.'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ApplicationStatus,
    description: 'Filter applications by status',
    example: ApplicationStatus.PENDING_DESK_REVIEW,
    examples: {
      pending: {
        summary: 'Get pending applications',
        value: ApplicationStatus.PENDING_DESK_REVIEW
      },
      approved: {
        summary: 'Get approved applications',
        value: ApplicationStatus.APPROVED
      },
      rejected: {
        summary: 'Get rejected applications',
        value: ApplicationStatus.REJECTED
      },
      all: {
        summary: 'Get all applications (no filter)',
        value: undefined
      }
    }
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (starts from 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Applications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 50,
          description: 'Total number of applications matching the filter'
        },
        page: {
          type: 'number',
          example: 1,
          description: 'Current page number'
        },
        limit: {
          type: 'number',
          example: 10,
          description: 'Number of items per page'
        },
        totalPages: {
          type: 'number',
          example: 5,
          description: 'Total number of pages'
        },
        applications: {
          type: 'array',
          description: 'Array of application objects',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              applicationId: { type: 'string', example: 'APP-2025-001' },
              companyName: { type: 'string', example: 'Tech Solutions Ltd' },
              applicationStatus: { 
                type: 'string', 
                enum: ['PENDING', 'APPROVED', 'REJECTED'],
                example: 'PENDING'
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status value or failed to retrieve applications'
  })
  findAll(
    @Req() req:any,
    @Query('status') status?: ApplicationStatus,
    @Query('type') type?:ApplicationType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    const token = req.headers.authorization.split(' ')[1];
    try{
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if(!decoded._id || decoded.role !== 'Admin' || decoded.role !== 'Registrar'){
        throw new UnauthorizedException('Unauthorized')
      }
      return this.applicationsService.findAll(status, type, pageNum, limitNum);
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }

  /**
   * Get applications assigned to authenticated user
   * 
   * @description
   * Retrieves all applications that have been assigned to the currently authenticated user.
   * The user ID is extracted from the JWT token provided in the Authorization header.
   * Supports pagination to handle large datasets efficiently.
   * 
   * @param req - Express request object containing the authorization header
   * @param page - Page number for pagination (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Paginated list of applications assigned to the user with metadata
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or expired
   * @throws {BadRequestException} If failed to retrieve applications
   * 
   * @example
   * GET /applications/my-assignments?page=1&limit=10
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @ApiOperation({ 
    summary: 'Get applications assigned to authenticated user',
    description: 'Retrieves all applications assigned to the currently authenticated user. Requires a valid JWT token in the Authorization header.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (starts from 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Assigned applications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 15,
          description: 'Total number of applications assigned to the user'
        },
        page: {
          type: 'number',
          example: 1,
          description: 'Current page number'
        },
        limit: {
          type: 'number',
          example: 10,
          description: 'Number of items per page'
        },
        totalPages: {
          type: 'number',
          example: 2,
          description: 'Total number of pages'
        },
        applications: {
          type: 'array',
          description: 'Array of application objects assigned to the user',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              applicationId: { type: 'string', example: 'APP-2025-001' },
              contractorName: { type: 'string', example: 'Tech Solutions Ltd' },
              assignedTo: { type: 'string', example: '507f1f77bcf86cd799439012' },
              assignedToName: { type: 'string', example: 'John Doe' },
              applicationStatus: { 
                type: 'string', 
                enum: ['PENDING', 'APPROVED', 'REJECTED'],
                example: 'PENDING'
              },
              currentStatus: { type: 'string', example: 'Pending Desk Review' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to retrieve assigned applications'
  })
  @Get('my-assignments')
  getMyAssignments(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) { 
    try {
      // Extract token from authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token missing');
      }
      // Decode the JWT token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Extract the _id from the decoded token
      const userId = decoded._id;
      
      if (!userId || !decoded.role) {
        throw new UnauthorizedException('Not a valid user');
      }

      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 10;
      
      return this.applicationsService.findByAssignedTo(userId, pageNum, limitNum);
    } catch (err) {
      console.error('Error in getMyAssignments:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get all applications forwarded to registrar
   * 
   * @description
   * Retrieves all applications with status "Forwarded to Registrar".
   * This endpoint is specifically for registrars to view applications that require their review.
   * Supports pagination to handle large datasets efficiently.
   * Requires JWT authentication - registrar role verification.
   * 
   * @param page - Page number for pagination (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Paginated list of applications forwarded to registrar with metadata
   * 
   * @throws {UnauthorizedException} If token is invalid or missing
   * @throws {BadRequestException} If failed to retrieve applications
   * 
   * @example
   * GET /applications/registrar/forwarded?page=1&limit=10
   */
  @Get('registrar/forwarded')
  @ApiOperation({ 
    summary: 'Get applications forwarded to registrar',
    description: 'Retrieves all applications with status "Forwarded to Registrar" for registrar review. Requires authentication.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Applications forwarded to registrar retrieved successfully',
    schema: {
      example: {
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            applicationId: 'APP-2024-001',
            contractorName: 'ABC Construction Ltd',
            rcBnNumber: 'RC123456',
            sectorAndGrade: 'Works - Grade A',
            grade: 'A',
            type: 'New',
            submissionDate: '2024-01-15T10:30:00.000Z',
            applicationStatus: 'Forwarded to Registrar',
            slaStatus: 'On Time'
          }
        ],
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  async getForwardedToRegistrar(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Req() req?: any
  ) {
    try {
      // Extract and verify JWT token
      const authHeader = req?.headers?.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token missing');
      }

      // Decode and verify token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded || !decoded._id || decoded.role!=="Registrar") {
        throw new UnauthorizedException('Invalid token');
      }

      // Set pagination defaults
      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 10;

      // Fetch applications with "Forwarded to Registrar" status
      return this.applicationsService.findAll(
        ApplicationStatus.FORWARDED_TO_REGISTRAR,
        undefined,
        pageNum,
        limitNum
      );
    } catch (err) {
      console.error('Error in getForwardedToRegistrar:', err);
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Assign an application to a user
   * 
   * @description
   * Assigns a specific application to a user from the users collection.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * When an application is assigned, the user's assignedApps count is automatically incremented.
   * If the application was previously assigned to another user, their count is decremented.
   * 
   * @param id - Application ID (MongoDB ObjectId)
   * @param assignApplicationDto - DTO containing the user ID and name to assign to
   * @param req - Express request object containing the authorization header
   * @returns Updated application record with assignment information
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {NotFoundException} If application or user with given ID is not found
   * @throws {BadRequestException} If invalid request data
   * 
   * @example
   * PATCH /applications/assign/507f1f77bcf86cd799439011
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Body: {
   *   "userId": "507f1f77bcf86cd799439012",
   *   "userName": "John Doe"
   * }
   */
  @Patch('assign/:id')
  @ApiOperation({ 
    summary: 'Assign application to a user',
    description: 'Assigns an application to a specific user. Updates the assignedApps count for both the new and previous assignees (if any). Admin only.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Application ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: AssignApplicationDto,
    examples: {
      assign: {
        summary: 'Assign to user',
        value: {
          userId: '507f1f77bcf86cd799439012',
          userName: 'John Doe'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Application assigned successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        applicationId: { type: 'string', example: 'APP-2024-001' },
        contractorName: { type: 'string', example: 'ABC Construction Ltd' },
        assignedTo: { type: 'string', example: '507f1f77bcf86cd799439012' },
        assignedToName: { type: 'string', example: 'John Doe' },
        applicationStatus: { type: 'string', example: 'PENDING' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application or user not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin role required'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data'
  })
  assignApplication(
    @Param('id') id: string, 
    @Body() assignApplicationDto: AssignApplicationDto,
    @Req() req: any
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token required');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      
      if (!decoded._id || decoded.role !== 'Admin') {
        throw new UnauthorizedException('Admin role required');
      }
      
      return this.applicationsService.assignApplication(id, assignApplicationDto);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Update the status of an application
   * 
   * @description
   * Updates the status of a specific application identified by its ID.
   * This endpoint is restricted to users with Admin, Desk officer, Registrar, or Auditor roles.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param id - Application ID (MongoDB ObjectId)
   * @param updateApplicationStatusDto - DTO containing the new status
   * @param req - Express request object containing the authorization header
   * @returns Updated application record with new status
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user lacks required role
   * @throws {NotFoundException} If application with given ID is not found
   * @throws {BadRequestException} If invalid status value or request data
   * 
   * @example
   * PATCH /applications/status/507f1f77bcf86cd799439011
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Body: {
   *   "applicationStatus": "APPROVED"
   * }
   */
  @Patch('status/:id')
  @ApiOperation({ 
    summary: 'Update application status',
    description: 'Updates the status of an application. Status can be PENDING, APPROVED, or REJECTED.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Application ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: UpdateApplicationStatusDto,
    examples: {
      pending: {
        summary: 'Set status to Pending',
        value: {
          applicationStatus: ApplicationStatus.PENDING_DESK_REVIEW
        }
      },
      approved: {
        summary: 'Set status to Approved',
        value: {
          applicationStatus: ApplicationStatus.APPROVED
        }
      },
      rejected: {
        summary: 'Set status to Rejected',
        value: {
          applicationStatus: ApplicationStatus.REJECTED
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Application status updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        applicationId: { type: 'string', example: 'APP-2025-001' },
        companyName: { type: 'string', example: 'Tech Solutions Ltd' },
        applicationStatus: { 
          type: 'string', 
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          example: 'APPROVED'
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status value or request data'
  })
  updateApplicationStatus(
    @Param('id') id: string, 
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
    @Req() req:any
  ) { 
    const token = req.headers.authorization.split(' ')[1];
    try{
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if(!decoded._id || !decoded.role || decoded.role === "Auditor"){
        throw new UnauthorizedException('Unauthorized')
      }
      return this.applicationsService.updateApplicationStatus(id, updateApplicationStatusDto);
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }

  /**
   * Get a single application by ID
   * 
   * @description
   * Retrieves a specific application by its ID.
   * This endpoint is restricted to authenticated users in the users collection.
   * The user's authentication is verified through the JWT token provided in the Authorization header.
   * 
   * @param id - Application ID (MongoDB ObjectId)
   * @param req - Express request object containing the authorization header
   * @returns Application record with all details
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not authenticated
   * @throws {NotFoundException} If application with given ID is not found
   * 
   * @example
   * GET /applications/507f1f77bcf86cd799439011
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get application by ID',
    description: 'Retrieves a specific application by its ID. Requires authentication. Users collection only.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Application ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Application retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        applicationId: { type: 'string', example: 'APP-2025-001' },
        contractorName: { type: 'string', example: 'Tech Solutions Ltd' },
        companyId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        rcBnNumber: { type: 'string', example: 'RC123456' },
        grade: { type: 'string', example: 'Grade A' },
        applicationStatus: { 
          type: 'string', 
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          example: 'PENDING'
        },
        currentStatus: { type: 'string', example: 'Pending Desk Review' },
        assignedTo: { type: 'string', example: '507f1f77bcf86cd799439013' },
        assignedToName: { type: 'string', example: 'John Doe' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Valid user authentication required'
  })
  findOne(
    @Param('id') id: string,
    @Req() req: any
  ) {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing🤪');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing🫤');
    }

    try {
      // Decode and verify the JWT token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Verify that the user has a valid _id and role (users collection check)
      if (!decoded._id || !decoded.role) {
        throw new UnauthorizedException('You are not allowed to access this route😒');
      }

      return this.applicationsService.findOne(id);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired token 😒');
    }
  }
}
