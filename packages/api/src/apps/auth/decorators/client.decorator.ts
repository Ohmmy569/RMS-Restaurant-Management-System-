import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Client = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const client = request.client;

    return data ? client?.[data] : client;
  }
);
