import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryFieldsDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService, 
    private readonly jwtService: JwtService
  ) {}

  /**
   * Create a new category
   * 
   * @description
   * Creates a new category in the system.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param createCategoryDto - DTO containing the category details
   * @param req - Express request object containing the authorization header
   * @returns Created category record
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {BadRequestException} If invalid request data
   * 
   * @example
   * POST /categories
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Body: {
   *   "name": "Construction",
   *   "description": "Construction related services"
   * }
   */
  @ApiOperation({summary:"Create a category"})
  @ApiBody({type:CreateCategoryDto})
  @ApiResponse({status:200, description:"Category created successfully"})
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req:any) {
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
    return this.categoriesService.create(createCategoryDto)
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }

  /**
   * Get all categories
   * 
   * @description
   * Retrieves all categories from the system.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param req - Express request object containing the authorization header
   * @returns Array of all category records
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {BadRequestException} If failed to retrieve categories
   * 
   * @example
   * GET /categories
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @ApiOperation({summary:"Get all categories"})
  @ApiResponse({status:200, description:"All categories"})
  @Get()
  findAll(@Req() req:any) {
    const token = req.headers.authorization?.split(' ')[1];
    // if (!token) {
    //   throw new UnauthorizedException('Authorization token required');
    // }

    try {
      // const decoded = this.jwtService.verify(token, {
      //   secret: process.env.JWT_SECRET,
      // });
      
      // if (!decoded) {
      //   throw new UnauthorizedException('Unauthorized');
      // }
      return this.categoriesService.findAll();
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }

  /**
   * Update a category
   * 
   * @description
   * Updates the sector field of a category identified by its ID.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param id - Category ID (MongoDB ObjectId)
   * @param updateCategoryFieldsDto - DTO containing the sector field to update
   * @param req - Express request object containing the authorization header
   * @returns Updated category record
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {NotFoundException} If category with given ID is not found
   * @throws {BadRequestException} If invalid request data
   * 
   * @example
   * PATCH /categories/507f1f77bcf86cd799439011
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Body: {
   *   "sector": "works"
   * }
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update category sector',
    description: 'Updates the sector field of a category. Admin only.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Category ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: UpdateCategoryFieldsDto,
    examples: {
      updateSector: {
        summary: 'Update sector',
        value: {
          sector: 'works'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Category updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        sector: { type: 'string', example: 'works' },
        description: { type: 'string', example: 'Construction & Engineering' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin role required'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data'
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryFieldsDto: UpdateCategoryFieldsDto,
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
      
      return this.categoriesService.update(id, updateCategoryFieldsDto);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }

  /**
   * Add a new grade
   * 
   * @description
   * Creates a new grade with registration cost, financial capacity, and effective date.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param createGradeDto - DTO containing the grade details
   * @param req - Express request object containing the authorization header
   * @returns Created grade record
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {BadRequestException} If grade already exists or invalid request data
   * 
   * @example
   * POST /categories/grades
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Body: {
   *   "grade": "A",
   *   "registrationCost": 50000,
   *   "financialCapacity": 1000000,
   *   "effectiveDate": "2025-01-01"
   * }
   */
  @ApiOperation({ summary: 'Add a new grade' })
  @ApiBody({ type: CreateGradeDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Grade created successfully' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Grade already exists or invalid data'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin role required'
  })
  @Post('grades')
  createGrade(@Body() createGradeDto: CreateGradeDto, @Req() req: any) {
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
      
      return this.categoriesService.createGrade(createGradeDto);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }

  /**
   * Get all grades
   * 
   * @description
   * Retrieves all grades from the system.
   * This endpoint is accessible to authenticated users.
   * The user's authentication is verified through the JWT token provided in the Authorization header.
   * 
   * @param req - Express request object containing the authorization header
   * @returns Array of all grade records
   * 
   * @throws {UnauthorizedException} If token is missing or invalid
   * @throws {BadRequestException} If failed to retrieve grades
   * 
   * @example
   * GET /categories/grades
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @ApiOperation({ summary: 'Get all grades' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'All grades retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          grade: { type: 'string', enum: ['A', 'B', 'C', 'D'], example: 'A' },
          registrationCost: { type: 'number', example: 50000 },
          financialCapacity: { type: 'number', example: 1000000 },
          effectiveDate: { type: 'string', example: '2025-01-01' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Valid token required'
  })
  @Get('grades')
  findAllGrades(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token required');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      
      if (!decoded) {
        throw new UnauthorizedException('Unauthorized');
      }
      
      return this.categoriesService.findAllGrades();
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  /**
   * Get all grades for a specific category
   * 
   * @description
   * Retrieves all grades associated with a specific category.
   * The category name is case-insensitive.
   * 
   * @param category - The name of the category to get grades for
   * @returns Array of grade objects for the specified category
   * 
   * @throws {NotFoundException} If no grades are found for the specified category
   * @throws {BadRequestException} If there's an error retrieving the grades
   * 
   * @example
   * GET /categories/works/grades
   * 
   * Response:
   * [
   *   {
   *     "_id": "60d21b4667d0d8992e610c85",
   *     "category": "works",
   *     "grade": "A",
   *     "registrationCost": 50000,
   *     "renewalFee": 25000,
   *     "financialCapacity": 1000000,
   *     "createdAt": "2023-03-25T10:00:00.000Z",
   *     "updatedAt": "2023-03-25T10:00:00.000Z"
   *   },
   *   ...
   * ]
   */
  @ApiOperation({ summary: 'Get grades by category', description: 'Retrieves all grades for a specific category' })
  @ApiParam({ name: 'category', description: 'The name of the category to get grades for', example: 'works' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved grades for the category' })
  @ApiResponse({ status: 404, description: 'No grades found for the specified category' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':category/grades')
  async getGradesByCategory(@Param('category') category: string) {
    return this.categoriesService.findGradesByCategory(category);
  }

  /**
   * Update a grade
   * 
   * @description
   * Updates the registration cost, financial capacity, and/or effective date of a grade.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param id - Grade ID (MongoDB ObjectId)
   * @param updateGradeDto - DTO containing the fields to update
   * @param req - Express request object containing the authorization header
   * @returns Updated grade record
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {NotFoundException} If grade with given ID is not found
   * @throws {BadRequestException} If invalid request data
   * 
   * @example
   * PATCH /categories/grades/507f1f77bcf86cd799439011
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Body: {
   *   "registrationCost": 60000,
   *   "effectiveDate": "2025-02-01"
   * }
   */
  @ApiOperation({ 
    summary: 'Update grade details',
    description: 'Updates the registration cost, financial capacity, and/or effective date. Admin only.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Grade ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: UpdateGradeDto,
    examples: {
      updateAll: {
        summary: 'Update all fields',
        value: {
          registrationCost: 60000,
          financialCapacity: 1500000,
          effectiveDate: '2025-02-01'
        }
      },
      updateCostOnly: {
        summary: 'Update registration cost only',
        value: {
          registrationCost: 55000
        }
      },
      updateDateOnly: {
        summary: 'Update effective date only',
        value: {
          effectiveDate: '2025-03-01'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Grade updated successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin role required'
  })
  @Patch('grades/:id')
  updateGrade(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
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
      
      return this.categoriesService.updateGrade(id, updateGradeDto);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }

  /**
   * Delete a grade
   * 
   * @description
   * Deletes a specific grade identified by its ID.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param id - Grade ID (MongoDB ObjectId)
   * @param req - Express request object containing the authorization header
   * @returns Deleted grade record
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {NotFoundException} If grade with given ID is not found
   * @throws {BadRequestException} If invalid request data
   * 
   * @example
   * DELETE /categories/grades/507f1f77bcf86cd799439011
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @ApiOperation({ summary: 'Delete a grade' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Grade ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Grade deleted successfully' 
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin role required'
  })
  @Delete('grades/:id')
  removeGrade(@Param('id') id: string, @Req() req: any) {
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
      
      return this.categoriesService.removeGrade(id);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }

  /**
   * Delete a category
   * 
   * @description
   * Deletes a specific category identified by its ID.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param id - Category ID
   * @param req - Express request object containing the authorization header
   * @returns Confirmation of deletion
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {NotFoundException} If category with given ID is not found
   * @throws {BadRequestException} If invalid request data
   * 
   * @example
   * DELETE /categories/123
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @ApiOperation({summary:"Delete a category"})
  @ApiResponse({status:200, description:"Category deleted successfully"})
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req:any) {
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
      return this.categoriesService.remove(+id);
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }
}
