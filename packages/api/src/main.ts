import { AppModule } from "@/app.module";
import * as cookies from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(cookies());
  app.getHttpAdapter().getInstance().set("etag", false);
  app.getHttpAdapter().getInstance().disable("x-powered-by");

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  await app.listen(5000);
}

bootstrap();
