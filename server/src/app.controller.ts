import { Controller, Get } from '@nestjs/common';
import { BotService } from './bot/bot.service';

@Controller()
export class AppController {
  constructor(private readonly botService: BotService) {}

  @Get('/reputations')
  async getReputations() {
    const reputations = await this.botService.getAllReputations();
    return reputations.sort((a, b) => b.reputation - a.reputation);
  }
}
