import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis{
    private logger: Logger = new Logger(RedisService.name)
    constructor(){ 
        super();
        if(super.on){   
            this.logger.log("Redis working!");
        }else{
            this.logger.error("Redis server error!");
        };
    
    }
};
