import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the authenticated user from the request object
 * 
 * @description
 * This decorator retrieves the user object that was attached to the request
 * by the JwtAuthGuard after successful token validation.
 * 
 * @example
 * ```typescript
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@User() user: any) {
 *   return user;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Extract only the user ID
 * @Get('my-data')
 * @UseGuards(JwtAuthGuard)
 * getMyData(@User('id') userId: string) {
 *   return this.service.findByUserId(userId);
 * }
 * ```
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property is requested, return only that property
    return data ? user?.[data] : user;
  },
);
