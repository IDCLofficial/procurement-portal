import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService, 
    private readonly jwtService: JwtService
  ) {}

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
      
      if (!decoded._id || decoded.role !== 'Admin') {
        throw new UnauthorizedException('Admin role required');
      }
      return this.categoriesService.findAll();
    }catch(err){
      throw new UnauthorizedException('Unauthorized')
    }
  }

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
