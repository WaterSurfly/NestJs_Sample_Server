import {Logger, Module} from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [],
    providers: [ChatGateway, Logger],
    exports: [],
})
export class ChatModule {}
