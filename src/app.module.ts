import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [UserModule, RedisModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
