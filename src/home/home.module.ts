import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';
import { Prisma } from 'src/prisma/prisma.service';

@Module({
  imports:[],
  controllers: [HomeController],
  providers: [HomeService,Prisma,{
    provide:APP_INTERCEPTOR,
    useClass:ClassSerializerInterceptor
  },{
    provide:APP_GUARD,
    useClass:AuthGuard
  }]
})
export class HomeModule {}
