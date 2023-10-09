import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class Prisma extends PrismaClient implements OnModuleInit,OnModuleDestroy {
  async onModuleInit() {
    await this.$connect
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// @Injectable()
// export class Prisma extends PrismaClient implements OnModuleInit,OnModuleDestroy {
//   constructor(private prisma: PrismaClient) {
//     super();
//   }

//   getModel(modelName: string) {
//     // Return the appropriate Prisma model based on the model name
//     switch (modelName) {
//       case 'user':
//         return this.prisma.user;
//       case 'home':
//         return this.prisma.home;
      
//       default:
//         throw new Error(`Model '${modelName}' not found.`);
//     }
//   }

//   async onModuleInit() {
//     await this.$connect
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }

// }
