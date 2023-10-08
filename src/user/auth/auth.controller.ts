import { Body, Controller,Get,Param,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto,SigninDto, GenerateProductKeyDto, UserTypeDto } from '../dtos/auth.dto';

import { User,UserInfo } from '../decorators/user.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('users')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService) {}

  @Post('/signup/:userType')
  async signup(@Body() body:SignupDto ,@Param('userType') userTypeDto:UserTypeDto)
  {
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
