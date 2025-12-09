import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSlaDto } from './dto/update-sla.dto';
import { Sla } from './entities/sla.schema';

@Injectable()
export class SlaService {
  private readonly logger = new Logger(SlaService.name);

  constructor(
    @InjectModel(Sla.name) private slaModel: Model<Sla>
  ) {}

  async getCurrentSla(): Promise<Sla> {
    try {
      // Get the first (and should be only) SLA configuration
      let sla = await this.slaModel.findOne();
      
      // If no SLA exists, create one with default values
      if (!sla) {
        sla = new this.slaModel({
          deskOfficerReview: 5,
          registrarReview: 3,
          clarificationResponse: 7,
          paymentVerification: 2,
          totalProcessingTarget: 10
        });
        await sla.save();
      }
      
      return sla;
    } catch (err) {
      this.logger.error(`Failed to retrieve SLA configuration: ${err.message}`);
      throw new BadRequestException('Failed to retrieve SLA configuration');
    }
  }

  async updateSla(updateSlaDto: UpdateSlaDto): Promise<Sla> {
    try {
      // Get the current SLA configuration
      let sla = await this.slaModel.findOne();
      
      // If no SLA exists, create one
      if (!sla) {
        sla = new this.slaModel({
          deskOfficerReview: 5,
          registrarReview: 3,
          clarificationResponse: 7,
          paymentVerification: 2,
          totalProcessingTarget: 10
        });
      }

      // Update only the provided fields
      if (updateSlaDto.deskOfficerReview !== undefined) {
        sla.deskOfficerReview = updateSlaDto.deskOfficerReview;
      }
      if (updateSlaDto.registrarReview !== undefined) {
        sla.registrarReview = updateSlaDto.registrarReview;
      }
      if (updateSlaDto.clarificationResponse !== undefined) {
        sla.clarificationResponse = updateSlaDto.clarificationResponse;
      }
      if (updateSlaDto.paymentVerification !== undefined) {
        sla.paymentVerification = updateSlaDto.paymentVerification;
      }
      if (updateSlaDto.totalProcessingTarget !== undefined) {
        sla.totalProcessingTarget = updateSlaDto.totalProcessingTarget;
      }

      return await sla.save();
    } catch (err) {
      this.logger.error(`Failed to update SLA configuration: ${err.message}`);
      throw new BadRequestException('Failed to update SLA configuration');
    }
  }
}
