import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetToken = createParamDecorator((data: any, req: ExecutionContext) => {
    return req?.switchToHttp().getRequest().headers.authorization
})