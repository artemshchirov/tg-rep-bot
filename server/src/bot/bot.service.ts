import { Controller, OnModuleInit } from '@nestjs/common';
import { Prisma, Reputations } from '@prisma/client';
import TelegramBot = require('node-telegram-bot-api');
import { PrismaService } from 'src/prisma.service';

@Controller()
export class BotService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.botMessage();
  }

  async botMessage() {
    const bot = new TelegramBot(process.env.BOT_API_TOKEN, {
      polling: true,
    });

    const reputationWords = [
      'תודה',
      'спасибо',
      'спс',
      'благодарю',
      'мерси',
      'спсб',
      'респект',
      'благодарен',
      'признателен',
      'заценил',
      'ценю',
      'благодарствую',
      'благодарность',
      'отлично',
      'thanks',
      'thank',
      'thx',
      'ty',
      'respect',
      'grateful',
      'appreciate',
    ];

    bot.on('new_chat_members', (msg) =>
      bot.sendMessage(
        msg.chat.id,
        `Привет, ${msg.new_chat_members[0].first_name}. Welcome в наш чат!`,
      ),
    );

    bot.on(
      'left_chat_member',
      async (msg) =>
        await this.removeReputation(String(msg.left_chat_member.id)),
    );

    bot.on('message', async (msg) => {
      if (msg.reply_to_message) {
        const user = await bot.getChatMember(
          msg.chat.id,
          msg.reply_to_message.from.id,
        );

        if (user.status === 'left') return;

        if (msg?.sticker) {
          if (msg.sticker.emoji === '👍') {
            this.handleThanksWordReaction(msg, bot);
          }
          return;
        }

        if (
          msg.reply_to_message.from.username === 'vibe_validator_bot' ||
          msg.reply_to_message.from.username === msg.from.username
        ) {
          return;
        }

        const reputationWord = msg.text
          .toLowerCase()
          .split(' ')
          .find((word) =>
            reputationWords.includes(
              word.replace(/[&\/\\#,+()$~%.'":*?!<>{}]/g, ''),
            ),
          );

        if (reputationWord) {
          this.handleThanksWordReaction(msg, bot);
        }
      }
    });
  }

  async getAllReputations(): Promise<Reputations[]> {
    return await this.prisma.reputations.findMany();
  }

  async removeReputation(telegramId: string) {
    const user = await this.prisma.reputations.findFirst({
      where: { telegramId },
    });

    if (user) {
      await this.prisma.reputations.delete({ where: { id: user.id } });
    }
  }

  async sendReputationMessage(
    chatId: number,
    replyUsername: string,
    fromUsername: string,
    bot: TelegramBot,
    telegramId: string,
  ) {
    const reputationData = await this.getReputation(telegramId);

    bot.sendMessage(
      chatId,
      `Поздравляю, ${replyUsername} ! Участник ${fromUsername} повысил твою репутацию, так держать! Твоя репутация ${reputationData.reputation}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Статистика чата',
                url: 'https://members-reputation.vercel.app',
              },
            ],
          ],
        },
      },
    );
  }

  async getReputation(telegramId: string): Promise<Reputations> {
    return await this.prisma.reputations.findFirst({
      where: { telegramId },
    });
  }

  async updateReputation(reputation: number, id: number): Promise<void> {
    await this.prisma.reputations.update({
      where: { id },
      data: { reputation },
    });
  }

  async addNewReputation(data: Prisma.ReputationsCreateInput): Promise<void> {
    await this.prisma.reputations.create({ data });
  }

  async increaseReputation(
    telegramId: string,
    username: string,
    fullName: string,
    userAvatar: string,
  ) {
    const reputationData = await this.getReputation(telegramId);

    if (reputationData) {
      await this.updateReputation(
        reputationData.reputation + 1,
        reputationData.id,
      );
      return;
    }

    await this.addNewReputation({
      telegramId,
      username,
      userAvatar,
      fullName,
      reputation: 1,
    });
  }

  async handleThanksWordReaction(msg: TelegramBot.Message, bot: TelegramBot) {
    const telegramId = String(msg.reply_to_message.from.id);
    const userAvatar = await this.getUserAvatarUrl(
      msg.reply_to_message.from.id,
      bot,
    );

    const username = `${msg.reply_to_message.from?.first_name} ${
      msg.reply_to_message.from.username
        ? `(@${msg.reply_to_message.from.username})`
        : ''
    }`;
    const fullName = `${msg.reply_to_message.from?.first_name} ${msg.reply_to_message.from?.last_name}`;

    await this.increaseReputation(telegramId, username, fullName, userAvatar);

    await this.sendReputationMessage(
      msg.chat.id,
      username,
      msg.from.first_name,
      bot,
      telegramId,
    );
  }

  async getUserAvatarUrl(userId: number, bot: TelegramBot) {
    const userProfile = await bot.getUserProfilePhotos(userId);

    if (!userProfile.photos.length) return '';

    const fileId = userProfile.photos[0][0].file_id;
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;

    return `https://api.telegram.org/file/bot${process.env.BOT_API_TOKEN}/${filePath}`;
  }
}
