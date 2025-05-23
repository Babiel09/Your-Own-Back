import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaModule } from 'prisma/prisma.module';
import { CreateUserDTO } from './DTO/user.create.dto';

@Module({
  controllers: [UserController],
  providers: [UserService,CreateUserDTO],
  imports: [RedisModule,PrismaModule],
})
export class UserModule {}
