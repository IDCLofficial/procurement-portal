import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UnauthorizedException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
  async vendorNotifications(
    @Req() req:any,
    @Query() query:{
      isRead?:boolean
    } 
  ) {
    try{
      const header = req.headers.authorization;
      if(!header){
        this.logger.log(`Authorization header missing`);
        throw new UnauthorizedException('Unauthorized');
      }
      const vendorId = this.jwtService.decode(header.split(" ")[1])._id;
      if(!vendorId){
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      return await this.notificationsService.findVendorNotifications(vendorId, query);
    }catch(err){
      this.logger.log(`User is not authorized to access this endpoint`);
      throw new UnauthorizedException('User is not authorized to access this endpoint');
    }
  }

  /**
   * Delete a single notification for the authenticated vendor.
   *
   * @param req - HTTP request containing the Authorization bearer token.
   * @param notificationId - ID of the notification to delete.
   * @returns Deletion result including deletedCount.
   */
  @ApiOperation({
    summary: 'Delete a vendor notification',
    description: 'Deletes a single notification that belongs to the authenticated vendor.',
  })
  @ApiParam({
    name: 'notificationId',
    description: 'ID of the notification to delete',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Delete('vendor-notification/:notificationId')
  async deleteVendorNotification(
    @Req() req: any,
    @Param('notificationId') notificationId: string,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        this.logger.log(`Authorization header missing`);
        throw new UnauthorizedException('Unauthorized');
      }
      const vendorId = this.jwtService.decode(header.split(' ')[1])._id;
      if (!vendorId) {
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      return await this.notificationsService.deleteVendorNotification(vendorId, notificationId);
    } catch (err) {
      this.logger.log(`User is not authorized to access this endpoint`);
      throw new UnauthorizedException('User is not authorized to access this endpoint');
    }
  }

  /**
   * Delete multiple notifications for the authenticated vendor.
   *
   * @param req - HTTP request containing the Authorization bearer token.
   * @param body - Object containing an array of notificationIds to delete.
   * @returns Deletion result including deletedCount.
   */
  @ApiOperation({
    summary: 'Delete multiple vendor notifications',
    description: 'Deletes multiple notifications that belong to the authenticated vendor using a list of notification IDs.',
  })
  @ApiBody({
    description: 'List of notification IDs to delete',
    schema: {
      type: 'object',
      properties: {
        notificationIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of notification IDs',
        },
      },
      required: ['notificationIds'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notifications deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Post('vendor-notification/delete-many')
  async deleteMultipleVendorNotifications(
    @Req() req: any,
    @Body() body: { notificationIds: string[] },
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        this.logger.log(`Authorization header missing`);
        throw new UnauthorizedException('Unauthorized');
      }
      const vendorId = this.jwtService.decode(header.split(' ')[1])._id;
      if (!vendorId) {
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      return await this.notificationsService.deleteMultipleVendorNotifications(
        vendorId,
        body.notificationIds,
      );
    } catch (err) {
      this.logger.log(`User is not authorized to access this endpoint`);
      throw new UnauthorizedException('User is not authorized to access this endpoint');
    }
  }

  /**
   * Delete all notifications for the authenticated vendor.
   *
   * @param req - HTTP request containing the Authorization bearer token.
   * @returns Deletion result including deletedCount.
   */
  @ApiOperation({
    summary: 'Delete all vendor notifications',
    description: 'Deletes all notifications that belong to the authenticated vendor.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All vendor notifications deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Delete('vendor-notification')
  async deleteAllVendorNotifications(
    @Req() req: any,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        this.logger.log(`Authorization header missing`);
        throw new UnauthorizedException('Unauthorized');
      }
      const vendorId = this.jwtService.decode(header.split(' ')[1])._id;
      if (!vendorId) {
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      return await this.notificationsService.deleteVendorNotifications(vendorId);
    } catch (err) {
      this.logger.log(`User is not authorized to access this endpoint`);
      throw new UnauthorizedException('User is not authorized to access this endpoint');
    }
  }

  @ApiOperation({
    summary: 'Mark all vendor notifications as read',
    description: 'Marks all notifications belonging to the authenticated vendor as read.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All vendor notifications marked as read successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Patch('mark-all-vendor-as-read')
  async markAllVendorAsRead(
    @Req() req:any 
  ) {
    try{
      const header = req.headers.authorization;
      if(!header){
        this.logger.log(`Authorization header missing`);
        throw new UnauthorizedException('Unauthorized');
      }
      const vendorId = this.jwtService.decode(header.split(" ")[1])._id;
      if(!vendorId){
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      return await this.notificationsService.markAllVendorAsRead(vendorId);
    }catch(err){
      this.logger.log(`User is not authorized to access this endpoint`);
      throw new UnauthorizedException('User is not authorized to access this endpoint');
    }
  }

  @ApiOperation({
    summary: 'Mark all admin notifications as read',
    description: 'Marks all admin notifications as read for the currently authenticated admin user.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All admin notifications marked as read successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Post('mark-all-admin-as-read')
  async markAllAdminAsRead(
    @Req() req:any 
  ){
    try{
      const header = req.headers.authorization;
      if(!header){
        this.logger.log(`Authorization header missing`);
        throw new UnauthorizedException('Unauthorized');
      }
      const decoded = this.jwtService.decode(header.split(" ")[1]);
      if(!decoded || decoded.role !== 'Admin'){
        this.logger.log(`User is not authorized to access this endpoint`);
        throw new UnauthorizedException('User is not authorized to access this endpoint');
      }
      return await this.notificationsService.markAllAdminAsRead();
    }catch(err){
      this.logger.log(`User is not authorized to access this endpoint`);
      throw new UnauthorizedException('User is not authorized to access this endpoint');
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
  async adminNotification(
    @Req() req:any,
    @Query() query:{
      isRead?:boolean
    }){
    try{
      const header = req.headers.authorization;
      if(!header){
        this.logger.log(`Authorization header is missing`);
        throw new UnauthorizedException('Unauthorized');
      }
      const decoded = this.jwtService.decode(header.split(" ")[1]);
      if(!decoded || decoded.role !== 'Admin'){
        this.logger.log(`User is not authorized to access this endpoint`);
        throw new UnauthorizedException('User is not authorized to access this endpoint');
      }
      return await this.notificationsService.findAdminNotifications(query);
    }catch(err){
      this.logger.log(`Unauthorized user trying to access the endpoint`);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
