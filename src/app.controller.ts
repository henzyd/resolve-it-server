import { Controller, Get, Request } from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Request() req: ExpressRequest): string {
    const protocol = req.protocol;
    const host = req.get("host");
    const originalUrl = req.originalUrl;
    const fullUrl = `${protocol}://${host}${originalUrl}`;

    return this.appService.getHello(fullUrl);
  }
}
