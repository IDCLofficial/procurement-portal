import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

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

  @Get('summary')
  summary(@Req() req:any) {
    if(!req.user || req.user.role !== 'Admin'){
      throw new UnauthorizedException('Unauthorized, contact admin or get out of here')
    }
    return this.walletService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(+id);
  }
}
