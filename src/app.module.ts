import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { MailModule } from "./mail/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get<string>("DATABASE_URL"),
        entities: [join(__dirname, "**", "*.entity.{ts,js}")],
        synchronize: configService.get<string>("NODE_ENV") !== "production",
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("EMAIL_HOST"),
          secure: true,
          auth: {
            user: configService.get<string>("EMAIL_USERNAME"),
            pass: configService.get<string>("EMAIL_PASSWORD"),
          },
        },
        defaults: {
          from: "ResolveIt <onboarding@zydcode.com>",
        },
        template: {
          dir: join(process.cwd(), "src/common/templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
