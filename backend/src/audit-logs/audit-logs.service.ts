import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument, AuditAction, AuditSeverity, EntityType } from './entities/audit-log.schema';

export interface CreateAuditLogParams {
  actor: string;
  actorId?: string;
  role: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  details: string;
  severity?: AuditSeverity;
  ipAddress: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>
  ) {}

  /**
   * Create a new audit log entry
   */
  async create(params: CreateAuditLogParams): Promise<AuditLog> {
    try {
      const auditLog = new this.auditLogModel({
        timestamp: new Date(),
        actor: params.actor,
        actorId: params.actorId,
        role: params.role,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details,
        severity: params.severity || AuditSeverity.INFO,
        ipAddress: params.ipAddress,
        metadata: params.metadata
      });

      return await auditLog.save();
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all audit logs with optional filtering
   */
  async findAll(filters?: {
    entityType?: EntityType;
    entityId?: string;
    actor?: string;
    action?: AuditAction;
    severity?: AuditSeverity;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
  }): Promise<{ data: AuditLog[]; total: number; page: number; pageSize: number; totalPages: number; count: number; limit: number; skip: number }> {
    try {
      const query: any = {};

      if (filters?.entityType) query.entityType = filters.entityType;
      if (filters?.entityId) query.entityId = filters.entityId;
      if (filters?.actor) query.actor = new RegExp(filters.actor, 'i');
      if (filters?.action) query.action = filters.action;
      if (filters?.severity) query.severity = filters.severity;
      
      if (filters?.startDate || filters?.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = filters.startDate;
        if (filters.endDate) query.timestamp.$lte = filters.endDate;
      }

      const limit = filters?.limit || 50;
      const skip = filters?.skip || 0;

      const [data, total] = await Promise.all([
        this.auditLogModel
          .find(query)
          .sort({ timestamp: -1 })
          .limit(limit)
          .skip(skip)
          .exec(),
        this.auditLogModel.countDocuments(query).exec()
      ]);

      const pageSize = limit;
      const page = pageSize > 0 ? Math.floor(skip / pageSize) + 1 : 1;
      const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;

      return { 
        data, 
        total, 
        page, 
        pageSize, 
        totalPages, 
        count: data.length, 
        limit, 
        skip 
      };
    } catch (error) {
      this.logger.error(`Failed to fetch audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  async findByEntity(entityType: EntityType, entityId: string): Promise<AuditLog[]> {
    try {
      return await this.auditLogModel
        .find({ entityType, entityId })
        .sort({ timestamp: -1 })
        .exec();
    } catch (error) {
      this.logger.error(`Failed to fetch audit logs for entity: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get recent audit logs
   */
  async findRecent(limit: number = 10): Promise<AuditLog[]> {
    try {
      return await this.auditLogModel
        .find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.error(`Failed to fetch recent audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }
}
