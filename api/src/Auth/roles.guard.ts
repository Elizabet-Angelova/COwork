import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from 'express';
import { UserRole } from "src/Enums/user-role";
import { User } from "src/Entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        role: UserRole,
    ) {
        this.role = role;
    }
    private role: UserRole;
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as User;

        return user?.role === this.role;
    }
}
