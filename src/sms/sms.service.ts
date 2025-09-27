import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainBalanceEntity } from 'src/user/entity/mainbalance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SmsService {
    @InjectRepository(MainBalanceEntity)
    private readonly main_balance: Repository<MainBalanceEntity>;

    constructor() {}

    sendSms(to: string, message: string): string {
       
        return `SMS sent to ${to}: ${message}`;
    }

    formatDateToISO(dateStr: string): string {
  
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`; 
    }

    async is_valid_transaction(amount : number , asking_amount : number ,userId : number) : Promise<boolean> {
        const main_balance = await this.main_balance.findOne({
            where : {
                user : { user_id : userId }
            }
        });
        if(main_balance == null) {
            return false;
        }
        const balance = main_balance.balance;
        if((asking_amount-amount)=== balance) {
            return true;
        }
        return false;
    }
}