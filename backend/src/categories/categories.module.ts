import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './entities/category.schema';
import { Grade, GradeSchema } from './entities/grade.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Grade.name, schema: GradeSchema }
    ])
  ],
})
export class CategoriesModule {}
