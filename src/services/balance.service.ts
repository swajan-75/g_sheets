import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { MainBalanceEntity } from 'src/user/entity/mainbalance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BalanceService {
  private balanceFile = 'src/data/balance.hash';
  private lastHash: string = '';
  private salt: string;

  @InjectRepository(MainBalanceEntity)
   private readonly main_balance: Repository<MainBalanceEntity>;

  constructor() {
    this.salt = 'random_salt_123'; 
    this.loadHash();
  }


  private hashBalance(balance: number): string {
    return crypto
      .createHash('sha256')
      .update(balance.toString() + this.salt)
      .digest('hex');
  }


  private loadHash() {
    if (fs.existsSync(this.balanceFile)) {
      this.lastHash = fs.readFileSync(this.balanceFile, 'utf-8').trim();
    }
  }


  private saveHash(balance: number) {
    this.lastHash = this.hashBalance(balance);
    fs.writeFileSync(this.balanceFile, this.lastHash);
  }
  getLastHash(): string {
    return this.lastHash;
  }

  async getMainBalance(userId: number) {
    const main_balance = await this.main_balance.findOne({
        where : {
            user : { user_id : userId }
        }
    });
    if(main_balance == null) {
        return{
            status : 404,
            message : 'User not found'
        }
    }
    return {
        status : 200,
        balance : main_balance.balance
    }
  }

  async updateBalance(newBalance : number , userId) {
    const main_balance_entity = await this.main_balance.findOne({
        where : {
            user : { user_id : userId }
        }
    });
    if(main_balance_entity == null) {
        return{
            status : 404,
            message : 'User not found'
        }
    }
    main_balance_entity.balance = newBalance;
    main_balance_entity.updated_at = new Date();
    await this.main_balance.save(main_balance_entity);
    
    return {
        status : 200,
        message : 'Balance updated successfully',
    }
  }

  async credit_balance(amount: number, userId: number) {
    const main_balance = await this.main_balance.findOne({
        where : {
            user : { user_id : userId }
        }
    });
    if(main_balance===null) {
        return{
            status : 404,
            message : 'User not found'
        }
    }
    const newBalance = main_balance.balance + amount;
    const resp =  await this.updateBalance(newBalance,userId);
    return resp;

  }
    async debit_balance(amount: number, userId: number) {
    const main_balance = await this.main_balance.findOne({
        where : {
            user : { user_id : userId }
        }
    });
    if(main_balance===null) {
        return{
            status : 404,
            message : 'User not found'
        }
    }
    if(main_balance.balance < amount) {
        return{
            status : 400,
            message : 'Insufficient balance'
        }
    }
    const newBalance = main_balance.balance - amount;
    const resp =  await this.updateBalance(newBalance,userId);
    return resp;

  }

 
  
}
