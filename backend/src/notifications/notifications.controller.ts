import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Get all notifications for the authenticated user
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get user notifications',
    description: 'Retrieves all notifications for the authenticated user with pagination'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notifications retrieved successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = this.extractUserId(req);
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 20;
    
    return this.notificationsService.findAllByUser(userId, pageNum, limitNum);
  }

  /**
   * Get unread notifications count
   */
  @Get('unread/count')
  @ApiOperation({ 
    summary: 'Get unread notifications count',
    description: 'Returns the count of unread notifications for the authenticated user'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Unread count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        unreadCount: { type: 'number', example: 5 }
      }
    }
  })
  async getUnreadCount(@Req() req: any) {
    const userId = this.extractUserId(req);
    const count = await this.notificationsService.getUnreadCount(userId);
    return { unreadCount: count };
  }

  /**
   * Mark a notification as read
   */
  @Patch(':id/read')
  @ApiOperation({ 
    summary: 'Mark notification as read',
    description: 'Marks a specific notification as read'
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notification marked as read' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Notification not found' 
  })
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    const userId = this.extractUserId(req);
    return this.notificationsService.markAsRead(id, userId);
  }

  /**
   * Mark all notifications as read
   */
  @Patch('read/all')
  @ApiOperation({ 
    summary: 'Mark all notifications as read',
    description: 'Marks all notifications for the authenticated user as read'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'All notifications marked as read',
    schema: {
      type: 'object',
      properties: {
        modifiedCount: { type: 'number', example: 10 }
      }
    }
  })
  async markAllAsRead(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.notificationsService.markAllAsRead(userId);
  }

  /**
   * Delete a notification
   */
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete notification',
    description: 'Deletes a specific notification'
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Notification deleted successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Notification not found' 
  })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = this.extractUserId(req);
    return this.notificationsService.remove(id, userId);
  }

  /**
   * Helper method to extract user ID from JWT token
   */
  private extractUserId(req: any): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = decoded._id || decoded.sub || decoded.id;
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return userId;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
