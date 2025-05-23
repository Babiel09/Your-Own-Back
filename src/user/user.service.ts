import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
    private logger:Logger = new Logger(UserService.name);
    constructor(private redisservice:RedisService, private prismaService:PrismaService){};
};
