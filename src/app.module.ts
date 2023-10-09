import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { UserInterceptor } from './user/interceptors/user.interceptor';

import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './user/middleware/auth.middleware';

@Module({
  imports: [UserModule, PrismaModule, HomeModule,JwtModule.register({
    secret: process.env.JSON_TOKEN_KEY, // Replace with your secret key
    signOptions: { expiresIn: process.env.JSON_TOKEN_EXPIRERS_IN }, // Optional: Set token expiration time
  })],
  controllers: [AppController],
  providers: [AppService
  //   ,{
  //   provide:APP_INTERCEPTOR,
  //   useClass:UserInterceptor
  // }
],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*'); // Apply middleware for all routes
  }
}
