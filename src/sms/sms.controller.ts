import { Body, Controller, Post } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { parseBkashMessage } from 'src/services/parser.service';
import { BalanceService } from 'src/services/balance.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsEntity } from 'src/user/entity/transactions.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { SmsService } from './sms.service';
@Controller('sms')
export class SmsController {
    

    constructor(
            @InjectRepository(TransactionsEntity)
            private readonly TransactionsRepo: Repository<TransactionsEntity>,
         
            @InjectRepository(UserEntity)
            private readonly userRepo: Repository<UserEntity>,
            private readonly balanceService: BalanceService,
            private readonly smsService: SmsService
    ) {
    }

    @Post()
    async receiveSms(@Body() body :{sms: string,email: string}) {
        const smsText = body.sms;
        

        const tx = parseBkashMessage(smsText);
        console.log('email:', body.email);
        console.log(smsText);
        console.log('Parsed transaction:', tx);
        
        if(tx == null) {
            return { 
                status : STATUS_CODES.BAD_REQUEST,
                message: 'Not a valid Bkash transaction message'
            };
        }
        
        const user = await this.userRepo.findOne({
            where: { email: body.email },
            relations: ['balance'],
          });
        
          if (!user) {
            return {
              status: STATUS_CODES.NOT_FOUND,
              message: 'User not found',
            };
          }
          if(await this.smsService.is_valid_transaction(parseFloat(tx.amount),parseFloat(tx.balance),user.user_id)) {
            const newBalance = await this.balanceService.credit_balance(parseFloat(tx.amount),user.user_id);

            const transaction =  this.TransactionsRepo.create({
                user : user,
                phone_number : tx.number,
                amount : parseFloat(tx.amount),
                trx_id : tx.trxId,
                date : this.smsService.formatDateToISO(tx.date),
                time : tx.time,
                reference : tx.reference,
                aksing_balance : parseFloat(tx.balance),
                type : 'credit'
            });
            await this.TransactionsRepo.save(transaction);
            return {
                status : STATUS_CODES.OK,
                message: 'Transaction successful!',
                user_id : user.user_id,
                email: body.email,
                transaction_id: transaction.transaction_id,
                new_balance: newBalance,
              };
          } else {
    
            return {
                status : STATUS_CODES.BAD_REQUEST,
                message: 'Transaction failed! Invalid Transaction'
              };
          }     

        
        }
    }