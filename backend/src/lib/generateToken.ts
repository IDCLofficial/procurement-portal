import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export default class TokenHandlers {
    constructor(private jwtService: JwtService) {}
    generateToken(user: any) {
        const token = this.jwtService.sign({
            sub: user._id || user.id,
            _id: user._id || user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            mda: user.mda,
        },{
            expiresIn:'24h'
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