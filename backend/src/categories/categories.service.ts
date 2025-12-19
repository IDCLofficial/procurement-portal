import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryFieldsDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.schema';
import { Grade } from './entities/grade.schema';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Grade.name) private gradeModel: Model<Grade>
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
    try{
      const categories = await this.categoryModel.find();
      const grades = await this.gradeModel.find();
      return {categories, grades};
    }catch(err){
      this.logger.error(`Failed to retrieve categories or grades: ${err.message}`);
      throw new BadRequestException('Failed to retrieve categories or grades');
    }
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

  async findAllGrades(): Promise<Grade[]> {
    try {
      const grades = await this.gradeModel
      .find()
      .sort({
        createdAt:-1
      })
      .exec();
      return grades;
    } catch (err) {
      this.logger.error(`Failed to retrieve grades: ${err.message}`);
      throw new BadRequestException('Failed to retrieve grades');
    }
  }

  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    try {
      const existingGrade = await this.gradeModel.findOne({ grade: createGradeDto.grade });
      if (existingGrade) {
        throw new BadRequestException(`Grade ${createGradeDto.grade} already exists`);
      }
      
      const newGrade = new this.gradeModel(createGradeDto);
      return await newGrade.save();
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      this.logger.error(`Failed to create grade: ${err.message}`);
      throw new BadRequestException('Failed to create grade');
    }
  }

  async updateGrade(id: string, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    try {
      const grade = await this.gradeModel.findById(id);
      
      if (!grade) {
        throw new NotFoundException('Grade not found');
      }

      if (updateGradeDto.registrationCost !== undefined) {
        grade.registrationCost = updateGradeDto.registrationCost;
      }
      
      if (updateGradeDto.financialCapacity !== undefined) {
        grade.financialCapacity = updateGradeDto.financialCapacity;
      }

      return await grade.save();
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to update grade: ${err.message}`);
      throw new BadRequestException('Failed to update grade');
    }
  }

  async removeGrade(id: string): Promise<Grade> {
    try {
      const grade = await this.gradeModel.findByIdAndDelete(id);
      if (!grade) {
        throw new NotFoundException('Grade not found');
      }
      return grade;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to delete grade: ${err.message}`);
      throw new BadRequestException('Failed to delete grade');
    }
  }
}
