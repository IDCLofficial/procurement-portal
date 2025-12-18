import { Controller, Get, Body, Patch, Req, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { SlaService } from './sla.service';
import { UpdateSlaDto } from './dto/update-sla.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('SLA')
@Controller('sla')
export class SlaController {
  constructor(
    private readonly slaService: SlaService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Get current SLA configuration
   * 
   * @description
   * Retrieves the current SLA timer configuration for the procurement system.
   * This endpoint is accessible to authenticated users.
   * The user's authentication is verified through the JWT token provided in the Authorization header.
   * 
   * @param req - Express request object containing the authorization header
   * @returns Current SLA configuration
   * 
   * @throws {UnauthorizedException} If token is missing or invalid
   * @throws {BadRequestException} If failed to retrieve SLA configuration
   * 
   * @example
   * GET /sla
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @ApiOperation({ summary: 'Get current SLA configuration' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'SLA configuration retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        deskOfficerReview: { type: 'number', example: 5 },
        registrarReview: { type: 'number', example: 3 },
        clarificationResponse: { type: 'number', example: 7 },
        paymentVerification: { type: 'number', example: 2 },
        totalProcessingTarget: { type: 'number', example: 10 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Valid token required'
  })
  @Get()
  getCurrentSla(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token required');
    }
      
    return this.slaService.getCurrentSla();
  }

  /**
   * Update SLA configuration
   * 
   * @description
   * Updates the SLA timer configuration for the procurement system.
   * This endpoint is restricted to Admin users only.
   * The user's role is verified through the JWT token provided in the Authorization header.
   * 
   * @param updateSlaDto - DTO containing the SLA fields to update
   * @param req - Express request object containing the authorization header
   * @returns Updated SLA configuration
   * 
   * @throws {UnauthorizedException} If token is missing, invalid, or user is not an Admin
   * @throws {BadRequestException} If invalid request data
   * 
   * @example
   * PATCH /sla
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * Body: {
   *   "deskOfficerReview": 5,
   *   "registrarReview": 3,
   *   "clarificationResponse": 7,
   *   "paymentVerification": 2,
   *   "totalProcessingTarget": 10
   * }
   */
  @ApiOperation({ 
    summary: 'Update SLA configuration',
    description: 'Updates the SLA timer configuration. Admin only.'
  })
  @ApiBody({ 
    type: UpdateSlaDto,
    examples: {
      updateAll: {
        summary: 'Update all SLA timers',
        value: {
          deskOfficerReview: 5,
          registrarReview: 3,
          clarificationResponse: 7,
          paymentVerification: 2,
          totalProcessingTarget: 10
        }
      },
      updatePartial: {
        summary: 'Update specific timers',
        value: {
          deskOfficerReview: 6,
          totalProcessingTarget: 12
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'SLA configuration updated successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin role required'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data'
  })
  @Patch()
  updateSla(
    @Body() updateSlaDto: UpdateSlaDto,
    @Req() req: any
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token required');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      
      if (!decoded._id || decoded.role !== 'Admin') {
        throw new UnauthorizedException('Admin role required');
      }
      
      return this.slaService.updateSla(updateSlaDto);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
