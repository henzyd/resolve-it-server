import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(url: string): string {
    return (
      "Welcome to Resolve It API - " + `<a href="${url}docs">Go to Docs<a>`
    );
  }
}
