import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UnauthorizedException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  private readonly logger: Logger = new Logger(NotificationsController.name);
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  //
  @ApiOperation({
    summary: 'Get vendor notifications',
    description: 'Returns all notifications for the currently authenticated vendor.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notifications retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Get('vendor-notification')
  async vendorNotifications(@Req() req:any) {
    try{
      const header = req.headers.authorization;
      if(!header){
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      const decoded = this.jwtService.decode(header.split(' ')[1]);
      if(!decoded){
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      return await this.notificationsService.findVendorNotifications(decoded);
    }catch(err){
      this.logger.log(`Unauthorized user trying to access the endpoint`);
      throw new UnauthorizedException('Unauthorized');
    }
  }

  //q
  @ApiOperation({
    summary: 'Get admin notifications',
    description: 'Returns all notifications for the currently authenticated admin.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notifications retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Get('admin-notification')
  async adminNotification(@Req() req:any){
    const decoded = this.jwtService.decode(req.headers.authorization.split(' ')[1]);
    if(decoded.role !== 'Admin'){
      this.logger.log(`Unauthorized user trying to access the endpoint`);
      throw new UnauthorizedException('Unauthorized');
    }
    return await this.notificationsService.findAdminNotifications(decoded);
  }
}
