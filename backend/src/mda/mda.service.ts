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

  async findAll() {
    const Mdas = await this.MdaModel.find({})
    return Mdas;
  }

  findOne(id: number) {
    return this.MdaModel.findById(id);
  }

  update(id: number, updateMdaDto: UpdateMdaDto) {
    return this.MdaModel.findByIdAndUpdate(id, updateMdaDto);
  }

  remove(id: number) {
    return this.MdaModel.findByIdAndDelete(id);
  }
}
