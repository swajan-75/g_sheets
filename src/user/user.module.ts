import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { MainBalanceEntity } from "./entity/mainbalance.entity";
import { TransactionsEntity } from "./entity/transactions.entity";
import { user_controller } from "./user.controller";

@Module({
    imports : [
        TypeOrmModule.forFeature([
            UserEntity,
            MainBalanceEntity,
            TransactionsEntity
        ])
    ],
    controllers : [user_controller],
    providers : [],
    exports : [TypeOrmModule]
})
export class UserModule {}