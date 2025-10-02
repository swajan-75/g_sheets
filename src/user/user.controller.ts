import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UnauthorizedException,
  Get,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { MainBalanceEntity } from './entity/mainbalance.entity';
import { user_dto } from '../dto/user.dto';
import { TransactionsEntity } from './entity/transactions.entity';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';


@Controller('user')
export class user_controller {
  constructor(
    private readonly authService: AuthService,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(MainBalanceEntity)
    private readonly balanceRepo: Repository<MainBalanceEntity>,
    @InjectRepository(TransactionsEntity)
    private readonly TransactionsRepo: Repository<TransactionsEntity>,
  ) {}

  @Post('register')
  async registerUser(@Body() body: user_dto) {
    const existingEmail = await this.userRepo.findOne({ where: { email: body.email } });
  if (existingEmail) {
    return { status: 400, message: 'Email already exists.' };
  }

  const existingUsername = await this.userRepo.findOne({ where: { username: body.username } });
  if (existingUsername) {
    return { status: 400, message: 'Username already exists.' };
  }

  const existingPhone = await this.userRepo.findOne({ where: { phone_number: body.phone_number } });
  if (existingPhone) {
    return { status: 400, message: 'Phone number already exists.' };
  }

    const user = this.userRepo.create(body);
    const savedUser = await this.userRepo.save(user);

    const balance = this.balanceRepo.create({
      user: savedUser,
      balance: 0,
    });
    await this.balanceRepo.save(balance);

    savedUser.balance = balance;
    await this.userRepo.save(savedUser);

    return {
      message: 'User registered successfully!',
      user_id: savedUser.user_id,
    };
  }

  @Post('login')
  async loginUser(@Body() body: { email: string; password: string },
  @Res() res: Response
) {
    const user = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.password !== body.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const payload = {
        sub : user.user_id,
        email : user.email
    }
    const token = await this.authService.generate_jwt(payload)
    res.cookie('token', token,{
        httpOnly: true,
        secure: true,  // set to true in production
        sameSite: 'none', 
        maxAge: 3600000, 
    });

    return res.json({
        status : 200,
        message : 'Login successful',
    })
    
    
  }

  @Post('transaction')
  async makeTansaction(
    @Body()
    body: {
      user_email: string;
      amount: number;
      mobile: string;
      trxid: string;
      type: 'credit' | 'debit';
    },
  ) {
    const user = await this.userRepo.findOne({
      where: { email: body.user_email },
      relations: ['balance'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user.');
    }

    if (body.type === 'debit' && user.balance.balance < body.amount) {
      throw new BadRequestException('Insufficient balance.');
    }

    const newBalance =
      body.type === 'credit'
        ? user.balance.balance + body.amount
        : user.balance.balance - body.amount;

    user.balance.balance = newBalance;
    await this.balanceRepo.save(user.balance);
    const transaction = this.TransactionsRepo.create({
      user: user,
      phone_number: body.mobile,
      amount: body.amount,
      trx_id: body.trxid,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toISOString().split('T')[1].split('.')[0],
      aksing_balance: newBalance,
      reference: 'Manual Entry',
      type: body.type,
    });
    await this.TransactionsRepo.save(transaction);

    return {
      message: 'Transaction successful!',
      user_id : user.user_id,
      email: body.user_email,
      transaction_id: transaction.transaction_id,
      new_balance: newBalance,
    };
  }

  @Get('alltransactions/:email')
  async getAllTransactions(@Param('email') user_email: string) {
    const user = await this.userRepo.findOne({
      where: { email: user_email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user.');
    }

    const transactions = await this.TransactionsRepo.find({
      where: { user: { user_id: user.user_id } },
      order: { date: 'DESC', time: 'DESC' },
    });

    return {
      user_id: user.user_id,
      email: user.email,
      test_email: user_email,
      transactions,
    };
  }
  @Get('mainbalance/:email')
    async getMainBalance(@Param('email') user_email: string) {
        const user = await this.userRepo.findOne({
        where: { email: user_email },
        relations: ['balance'],
        });

        if (!user) {
        throw new UnauthorizedException('Invalid user.');
        }

        return {
        user_id: user.user_id,
        email: user.email,
        balance: user.balance?.balance ?? 0,
        };
    }
}
