import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [RedisModule],
})
export class UserModule {}
