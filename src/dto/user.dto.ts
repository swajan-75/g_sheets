import { IsEmail, IsNotEmpty, IsNumberString, Length, Matches } from "class-validator";

export class user_dto {
    @IsNotEmpty({ message : 'Username Cannot be empty' })
    username: string;

    @IsNotEmpty({ message : 'Email Cannot be empty' })
    @IsEmail({},{ message : 'Invalid Email Address' })
    email : string;

    @IsNotEmpty({ message : 'Phone number Cannot be empty' })
    @IsNumberString({},{message: 'Phone number must contain only numbers'})
    @Length(11, 11, { message : 'Phone number must be 11 digits'})
    phone_number: string;

    @IsNotEmpty({ message : 'Password Cannot be empty'})
    @Length(6, 20, { message : 'Password must be between 6 and 20 characters'}
    )
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, { 
    message: 'Password must contain uppercase, lowercase, number, and special character' })
    password: string;
}