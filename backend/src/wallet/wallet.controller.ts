import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateCashoutDto } from './dto/create-cashout.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Req() req:any, @Body() createWalletDto: CreateWalletDto) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    return this.walletService.create(createWalletDto);
  }

  @Get('recent-transactions')
  @ApiOperation({ summary: 'Get recent processing fee transactions' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of transactions to return (default: 20)', type: Number })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by payment status (pending, verified, completed, failed)' })
  @ApiResponse({ status: 200, description: 'Returns recent processing fee transactions with stats' })
  getRecentTransactions(
    @Req() req:any,
    @Query('limit') limit?: string,
    @Query('status') status?: string
  ) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    const limitNum = limit ? parseInt(limit) : 20;
    return this.walletService.getRecentProcessingFeeTransactions(limitNum, status);
  }

  @Get('summary')
  summary(@Req() req:any) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    return this.walletService.getSummary();
  }

  @Get('mda-transactions')
  getMdaTransactions(@Req() req:any) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    return this.walletService.getMdaTransactions();
  }

  @Post('cashout')
  @ApiOperation({ summary: 'Create a new cashout request' })
  createCashout(@Req() req:any, @Body() createCashoutDto: CreateCashoutDto) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    const approvedBy = req.user.email || req.user._id;
    return this.walletService.createCashout(createCashoutDto, approvedBy);
  }

  @Patch('cashout/:cashoutId/complete')
  @ApiOperation({ summary: 'Mark a cashout as completed' })
  completeCashout(
    @Req() req:any,
    @Param('cashoutId') cashoutId: string,
    @Body('transactionReference') transactionReference: string
  ) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    return this.walletService.completeCashout(cashoutId, transactionReference);
  }

  @Get('cashout/history')
  @ApiOperation({ summary: 'Get cashout history' })
  @ApiQuery({ name: 'entity', required: false, description: 'Filter by entity (IIRS, MDA, BPPPI, IDCL)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return', type: Number })
  getCashoutHistory(
    @Req() req:any,
    @Query('entity') entity?: string,
    @Query('limit') limit?: string
  ) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    const limitNum = limit ? parseInt(limit) : 50;
    return this.walletService.getCashoutHistory(entity, limitNum);
  }

  @Get('my-mda-transactions')
  @ApiOperation({ summary: 'Get transactions for the authenticated MDA user' })
  @ApiResponse({ status: 200, description: 'Returns MDA transactions and summary' })
  getMyMdaTransactions(@Req() req:any) {
    if(!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Get MDA name from user object (adjust based on your auth structure)
    const mdaName = req.user.mda || req.user.mdaName;
    
    if(!mdaName) {
      throw new UnauthorizedException('MDA name not found in user profile');
    }

    return this.walletService.getMyMdaTransactions(mdaName);
  }
}
