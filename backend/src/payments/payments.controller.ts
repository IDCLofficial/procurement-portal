import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SplitPaymentService } from './payments.service';
import { 
  CreateSplitDto,
  UpdateSplitDto,
  InitializePaymentWithSplitDto,
 } from './dto/split-payment.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Vendor Payments')
@Controller('vendor-payments')
// @UseGuards(JwtAuthGuard) // Uncomment if using authentication
// @ApiBearerAuth()
export class SplitPaymentController {
  constructor(
    private readonly splitPaymentService: SplitPaymentService,
    private readonly jwtService:JwtService
  ) {}

  @Post('split')
  async createSplit(@Body() createSplitDto: CreateSplitDto) {
    return this.splitPaymentService.createSplit(createSplitDto);
  }

  @Get('split')
  async listSplits(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ) {
    return this.splitPaymentService.listSplits(page, perPage);
  }

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  @ApiResponse({ status: 200, description: 'All payments retrieved successfully' })
  async getAllPayments(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.splitPaymentService.getAllPayments(page, limit, status);
  }

  @Get('split/:id')
  async getSplit(@Param('id') id: string) {
    return this.splitPaymentService.getSplit(id);
  }

  @Put('split/:id')
  async updateSplit(
    @Param('id') id: string,
    @Body() updateSplitDto: UpdateSplitDto,
  ) {
    return this.splitPaymentService.updateSplit(id, updateSplitDto);
  }

  @Delete('split/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSplit(@Param('id') id: string) {
    return this.splitPaymentService.deleteSplit(id);
  }

  @Post('split/:id/subaccount/add')
  async addSubaccount(
    @Param('id') id: string,
    @Body() body: { subaccount: string; share: number },
  ) {
    return this.splitPaymentService.addSubaccountToSplit(
      id,
      body.subaccount,
      body.share,
    );
  }

  @Delete('split/:id/subaccount/remove')
  async removeSubaccount(
    @Param('id') id: string,
    @Body() body: { subaccount: string },
  ) {
    return this.splitPaymentService.removeSubaccountFromSplit(
      id,
      body.subaccount,
    );
  }

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize payment with split' })
  @ApiResponse({ status: 201, description: 'Payment initialized successfully' })
  async initializePayment(@Body() dto: InitializePaymentWithSplitDto, @Req() req:any) {
    if(!req.headers.authorization){
      throw new UnauthorizedException("Header is missing!")
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = this.jwtService.decode(token);

    if(!decoded){
      throw new UnauthorizedException("Expired or missing token")
    }
    const user = decoded;
    return this.splitPaymentService.initializePaymentWithSplit(dto, user);
  }

  @Get('verify/:reference')
  @ApiOperation({ summary: 'Verify split payment transaction' })
  @ApiResponse({ status: 200, description: 'Transaction verified' })
  async verifyPayment(@Param('reference') reference: string, @Req() req:any) {
    if(!req.headers.authorization){
      throw new UnauthorizedException("Header is missing!")
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = this.jwtService.decode(token);

    if(!decoded){
      throw new UnauthorizedException("Expired or missing token")
    }
    const userId = decoded._id;
    console.log(decoded)
    return this.splitPaymentService.verifyPayment(reference, userId);
  }

}