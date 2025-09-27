import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('transactions')
export class TransactionsEntity {
    @PrimaryGeneratedColumn()
    transaction_id : number;
    
    @Column()
    phone_number : string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount : number;

    @Column()
    trx_id : string;

    @Column({ nullable: true })
    reference : string;

    @Column({ type: 'date' })
    date : string;

    @Column({ type: 'time' })
    time : string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at : Date;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    aksing_balance : number;

    @Column({default: 'credit'})
    type : 'credit' | 'debit';

    

    @ManyToOne(() => UserEntity, user => user.transactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

}