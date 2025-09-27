import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
export class trx_dto{
    /*
    amount: match[1],
    number: match[2],
    trxId: match[3],
    date: match[4],
    time: match[5],
    */
    @IsNotEmpty()
    @IsNumberString({}, {
    message: 'Phone number must contain only numbers',
    })
    @Length(11,11,{
        message : "Phone number must be 11 digits ",
    })
    phone_number: string;
    
}