import { Injectable } from '@nestjs/common';
import { CreateMdaDto } from './dto/create-mda.dto';
import { UpdateMdaDto } from './dto/update-mda.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mda, mdaDocument } from './entities/mda.schema';
import { Model } from 'mongoose';

@Injectable()
export class MdaService {
  constructor(
    @InjectModel(Mda.name) private MdaModel:Model<mdaDocument>
  ){}
  async create(createMdaDto: CreateMdaDto) {
    const newMda = new this.MdaModel(createMdaDto)
    await newMda.save()
    return newMda;
  }

  async findAll(page: number = 1, limit: number = 50) {
    const pageNum = page && page > 0 ? page : 1;
    const limitNum = limit && limit > 0 ? limit : 50;
    const skip = (pageNum - 1) * limitNum;

    const [mdas, total] = await Promise.all([
      this.MdaModel.find({})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limitNum)
        .exec(),
      this.MdaModel.countDocuments().exec(),
    ]);

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      mdas,
    };
  }

  async findAllByNames(){
    
    const Mdas = await this.MdaModel.find({})

    return Mdas;
  }

  findOne(id: string) {
    return this.MdaModel.findById(id);
  }

  update(id: string, updateMdaDto: UpdateMdaDto) {
    return this.MdaModel.findByIdAndUpdate(id, updateMdaDto);
  }

  remove(id: string) {
    return this.MdaModel.findByIdAndDelete(id);
  }
}
