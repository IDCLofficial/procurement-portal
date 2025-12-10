import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { EntityType, AuditAction, AuditSeverity } from './entities/audit-log.schema';

@ApiTags('Audit Logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all audit logs',
    description: 'Retrieves audit logs with optional filtering by entity type, actor, action, severity, and date range'
  })
  @ApiQuery({ name: 'entityType', required: false, enum: EntityType })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'actor', required: false })
  @ApiQuery({ name: 'action', required: false, enum: AuditAction })
  @ApiQuery({ name: 'severity', required: false, enum: AuditSeverity })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  async findAll(
    @Query('entityType') entityType?: EntityType,
    @Query('entityId') entityId?: string,
    @Query('actor') actor?: string,
    @Query('action') action?: AuditAction,
    @Query('severity') severity?: AuditSeverity,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const filters = {
      entityType,
      entityId,
      actor,
      action,
      severity,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined,
    };

    return this.auditLogsService.findAll(filters);
  }

  @Get('recent')
  @ApiOperation({ 
    summary: 'Get recent audit logs',
    description: 'Retrieves the most recent audit log entries'
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findRecent(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.auditLogsService.findRecent(limitNum);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ 
    summary: 'Get audit logs for a specific entity',
    description: 'Retrieves all audit log entries for a specific entity (e.g., application, certificate)'
  })
  async findByEntity(
    @Param('entityType') entityType: EntityType,
    @Param('entityId') entityId: string,
  ) {
    return this.auditLogsService.findByEntity(entityType, entityId);
  }
}
