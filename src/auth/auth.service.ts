import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    
  constructor(private readonly jwtService: JwtService) {}
  async login(user : any){
    const payload = { 
        sub : user.user_id,
        email : user.email,
    }

    return{
        token : this.jwtService.sign(payload),
    }
  }
  generate_jwt(payload :{
    sub : number,
    email : string,
  }) : string {
    return this.jwtService.sign(payload);
  }
  async valid_jwt(tokern : string) : Promise<any>{
    return this.jwtService.verify(tokern);
  }
}