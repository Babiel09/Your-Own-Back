import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [RedisModule,PrismaModule],
})
export class UserModule {}
