import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeMail(email: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Welcome to ResolveIt - Let's Connect and Get Creative!",
        template: "welcome.hbs",
      });
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
    }
  }

  async sendRequestOtpMail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "ResolveIt - Verify Your Account",
        template: "otp.hbs",
        context: {
          code,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send request otp mail to ${email}`, error);
    }
  }
}
