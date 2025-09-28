import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { MainBalanceEntity } from 'src/user/entity/mainbalance.entity';
import { TransactionsEntity } from 'src/user/entity/transactions.entity';

import { BalanceService } from 'src/services/balance.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MainBalanceEntity,
      TransactionsEntity,
      UserEntity,
    ]),
  ],
  controllers: [SmsController],
  providers: [SmsService, BalanceService],
  exports: [SmsService], 
})
export class SmsModule {}
