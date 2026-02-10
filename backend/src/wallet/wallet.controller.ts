import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

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

  @Get('iirs-transactions')
  @ApiOperation({ summary: 'Get IIRS transactions with allocation and cashout history' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records per page (default: 20)', type: Number })
  @ApiResponse({ status: 200, description: 'Returns IIRS transactions and summary with pagination' })
  getIirsTransactions(
    @Req() req:any,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    if(!req.user || req.user.role !== 'iirs'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.walletService.getIirsTransactions(pageNum, limitNum);
  }

  @Post('cashout/generate')
  @ApiOperation({ summary: 'Generate cashout documents for all verified payments that have not been cashed out' })
  generateCashouts(@Req() req: any) {
    if (!req.user || req.user.role !== 'Admin') {
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here');
    }
    return this.walletService.generateCashoutsForVerifiedPayments();
  }

  @Patch('cashout/complete')
  @ApiOperation({ summary: 'Complete all unremitted cashouts (optionally filter by entity/MDA)' })
  @ApiQuery({ name: 'entity', required: false, description: 'Filter by entity (IIRS, MDA, BPPPI, IDCL)' })
  @ApiQuery({ name: 'mdaName', required: false, description: 'Filter by specific MDA name' })
  completeCashout(
    @Req() req:any,
    @Body('transactionReference') transactionReference: string,
    @Query('entity') entity?: string,
    @Query('mdaName') mdaName?: string
  ) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    return this.walletService.completeCashout(transactionReference, entity, mdaName);
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
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records per page (default: 20)', type: Number })
  @ApiResponse({ status: 200, description: 'Returns MDA transactions and summary with pagination' })
  getMyMdaTransactions(
    @Req() req:any,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    if(!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Get MDA name from user object (adjust based on your auth structure)
    const mdaName = req.user.mda;
    
    if(!mdaName) {
      throw new UnauthorizedException('MDA name not found in user profile');
    }

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.walletService.getMyMdaTransactions(mdaName, pageNum, limitNum);
  }
}
