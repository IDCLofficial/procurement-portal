import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export default class TokenHandlers {
    constructor(private jwtService: JwtService) {}
    generateToken(user: any) {
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        return token;
    }  
    validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}