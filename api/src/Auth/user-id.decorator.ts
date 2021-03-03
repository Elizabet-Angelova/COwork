import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/Entities/user.entity";

export const UserDecorator = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as User;
        return user;
    },
);