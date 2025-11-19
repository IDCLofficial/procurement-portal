import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Company, CompanyDocument, Status } from './entities/company.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const company = await this.companyModel.findOne({companyName: createCompanyDto.companyName})
      if(company){
        throw new BadRequestException('Company already exists')
      }
      
      const newCompany = new this.companyModel(createCompanyDto);
      return await newCompany.save();
    } catch (error) {
      throw new BadRequestException('Failed to create company', error.message);
    }
  }

  async findAll(status?: Status) {
    try{
      const filter: any = {};
      
      // Add status filter if provided
      if (status) {
        filter.status = status;
      }
      
      const companies = await this.companyModel.find(filter).exec();
      
      return {
        total: companies.length,
        companies: companies
      };
    }catch(err){
      throw new BadRequestException('Failed to get companies', err.message)
    }
  }

  async findOne(id: string) {
    try{
      const company = await this.companyModel.findOne({userId:new Types.ObjectId(id)})
      if(!company){
        throw new BadRequestException('Company not found')
      }
      return company
    }catch(err){
      throw new BadRequestException('Failed to get company', err.message)
    }
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<Company> {
    try {
      const company = await this.companyModel.findById(id);
      
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      company.status = updateStatusDto.status;
      return await company.save();
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to update company status', err.message);
    }
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
