import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
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
  @Get()
  findAll() {
    return this.mdaService.findAll();
  }

  @ApiOperation({ summary: 'Get MDA by ID' })
  @ApiParam({ name: 'id', required: true, description: 'MDA ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'MDA retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'MDA not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mdaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update MDA' })
  @ApiParam({ name: 'id', required: true, description: 'MDA ID' })
  @ApiBody({ type: UpdateMdaDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'MDA updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'MDA not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMdaDto: UpdateMdaDto) {
    return this.mdaService.update(+id, updateMdaDto);
  }

  @ApiOperation({ summary: 'Delete MDA' })
  @ApiParam({ name: 'id', required: true, description: 'MDA ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'MDA deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'MDA not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mdaService.remove(+id);
  }
}
