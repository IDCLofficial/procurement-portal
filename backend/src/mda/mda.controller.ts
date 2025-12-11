import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { MdaService } from './mda.service';
import { CreateMdaDto } from './dto/create-mda.dto';
import { UpdateMdaDto } from './dto/update-mda.dto';

@ApiTags('Mda')
@Controller('mda')
export class MdaController {
  constructor(private readonly mdaService: MdaService) {}

  @ApiOperation({ summary: 'Create MDA' })
  @ApiBody({ type: CreateMdaDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'MDA created successfully' })
  @Post()
  create(@Body() createMdaDto: CreateMdaDto) {
    return this.mdaService.create(createMdaDto);
  }

  @ApiOperation({ summary: 'Get all MDAs' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all MDAs' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (starts from 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.mdaService.findAll(pageNum, limitNum);
  }

  @ApiOperation({ summary: 'Get all MDAs by names' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all MDAs' })
  @Get('mda-names')
  findAllByNames() {
    return this.mdaService.findAllByNames();
  }


  @ApiOperation({ summary: 'Get MDA by ID' })
  @ApiParam({ name: 'id', required: true, description: 'MDA ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'MDA retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'MDA not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mdaService.findOne(id);
  }

  @ApiOperation({ summary: 'Update MDA' })
  @ApiParam({ name: 'id', required: true, description: 'MDA ID' })
  @ApiBody({ type: UpdateMdaDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'MDA updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'MDA not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMdaDto: UpdateMdaDto) {
    return this.mdaService.update(id, updateMdaDto);
  }

  @ApiOperation({ summary: 'Delete MDA' })
  @ApiParam({ name: 'id', required: true, description: 'MDA ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'MDA deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'MDA not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mdaService.remove(id);
  }
}
