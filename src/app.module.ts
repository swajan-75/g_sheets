import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleSheetsService } from './services/google-sheets.service';
import { TelegramService } from './services/telegram.service';
import { SmsController } from './sms/sms.controller';
import { BalanceService } from './services/balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    UserModule,
    SmsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: '',
      password: '',
      database: 'bkash_p2p',
      autoLoadEntities: true,
      synchronize: true,
    }),
    
  ],
  controllers: [AppController, SmsController],
  providers: [AppService, GoogleSheetsService, TelegramService , BalanceService],
})
export class AppModule {}
