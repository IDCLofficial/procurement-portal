import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryFieldsDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({sector: createCategoryDto.sector.toLowerCase()})
    if(category){
      throw new BadRequestException('Category already exists')
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async update(id: string, updateCategoryFieldsDto: UpdateCategoryFieldsDto): Promise<Category> {
    try {
      const category = await this.categoryModel.findById(id);
      
      if (!category) {
        throw new NotFoundException('Category not found');
      }

        // Update only the allowed fields
        if (updateCategoryFieldsDto.sector !== "") {
          category.sector = updateCategoryFieldsDto.sector;
        }
      
      return await category.save();
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to update category', err.message);
    }
  }

  async remove(id: number) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if(!category){
      throw new BadRequestException('Category not found')
    }
    return category;
  }
}
