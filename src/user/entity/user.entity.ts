import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MainBalanceEntity } from "./mainbalance.entity";
import { TransactionsEntity as TransactionEntity } from "./transactions.entity";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    user_id : number;

    @Column({ unique: true })
    username : string;
    
    @Column({ unique: true })
    email : string;
    @Column({ unique: true })
    phone_number : string;
    
    @OneToOne(() => MainBalanceEntity, balance => balance.user, { cascade: true })
    @JoinColumn()
    balance: MainBalanceEntity;

    @OneToMany(() => TransactionEntity, transaction => transaction.user)
    transactions: TransactionEntity[];

    @Column()
    password : string;
}