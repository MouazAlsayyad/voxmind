import { Body, Controller,Get,Param,Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto,SigninDto, GenerateProductKeyDto, UserTypeDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from "bcryptjs"
import { User,UserInfo } from '../decorators/user.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('users')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService) {}

  @Post('/signup/:userType')
  async signup(@Body() body:SignupDto ,@Param('userType') userTypeDto:UserTypeDto)
  {
    const userType = userTypeDto.userType;
    if(userType !== UserType.BUYER){
      if(!body.productKey){
        throw new UnauthorizedException()
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`
    
      const isValidProductKey = await bcrypt.compare(validProductKey,body.productKey)
    
      if(!isValidProductKey)
      {
        throw new UnauthorizedException() 
      }
    }
    return this.authService.signup(body,userTypeDto)
  }

  @Post('/signin')
  signin(@Body() body:SigninDto ){
    return this.authService.signin(body)
  }

  @Post('/key')
  generateProductKey(@Body() {userType,email}:GenerateProductKeyDto){
    return this.authService.generateProductKet(email,userType)
  }

  @ApiForbiddenResponse({description:"Forbidden"})
  @Get("my")
  me(@User() user:UserInfo){
    return user
  }

}
