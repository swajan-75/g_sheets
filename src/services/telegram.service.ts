import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { parseBkashMessage } from './parser.service';
import { GoogleSheetsService } from './google-sheets.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: any;

  constructor(private readonly sheetsService: GoogleSheetsService) {}

  onModuleInit() {
    this.bot = new TelegramBot('7908452236:AAGBQ8nws8k1pUNNU_swTgIiErhqhD9u8JY', { polling: true });

    this.bot.on('message', async (msg: any) => {
      const text = msg.text;
      console.log('Received message:', text);

      if (text && text.includes('You have received Tk')) {
        const tx = parseBkashMessage(text);
        if (tx) {
          await this.sheetsService.appendTransaction(tx);
        }
      }
    });
  }
}
