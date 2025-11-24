import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryFieldsDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

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
      return this.categoriesService.findAll();
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }

  /**
   * Update a category
   * 
   * @description
   * Updates specific fields of a category identified by its ID.
   * Only fee and effectiveDate fields can be updated.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param id - Category ID (MongoDB ObjectId)
   * @param updateCategoryFieldsDto - DTO containing the fields to update (fee and/or effectiveDate)
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
   *   "fee": 75000,
   *   "effectiveDate": "2025-02-01"
   * }
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update category fee and effective date',
    description: 'Updates only the fee and/or effectiveDate fields of a category. Admin only.'
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
      updateBoth: {
        summary: 'Update both fee and effective date',
        value: {
          fee: 75000,
          effectiveDate: '2025-02-01'
        }
      },
      updateFeeOnly: {
        summary: 'Update fee only',
        value: {
          fee: 60000
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
    description: 'Category updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        sector: { type: 'string', example: 'construction' },
        grade: { type: 'string', enum: ['A', 'B', 'C'], example: 'A' },
        fee: { type: 'number', example: 75000 },
        effectiveDate: { type: 'string', example: '2025-02-01' },
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
