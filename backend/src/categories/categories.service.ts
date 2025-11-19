import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({sector: createCategoryDto.sector})
    if(category){
      throw new BadRequestException('Category already exists')
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async remove(id: number) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if(!category){
      throw new BadRequestException('Category not found')
    }
    return category;
  }
}
