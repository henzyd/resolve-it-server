import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DatabaseExceptionFilter } from "./common/filters/database-exception.filter";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { transformValidationErrors } from "./common/utils/validation";

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(transformValidationErrors(errors));
      },
    }),
  );
  app.useGlobalFilters(
    new DatabaseExceptionFilter(),
    new GlobalExceptionFilter(),
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("ResolveIt API")
    .setDescription("This is the API docs for ResolveIt")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);
  await app.listen(PORT);
  console.log(`http://localhost:${PORT} - ${process.env.NODE_ENV}`);
}
void bootstrap();
