import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);

    @WebSocketServer() server: Server;

    @SubscribeMessage('msgToServer')
    public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
        this.logger.log(`SendMessage: ${JSON.stringify(payload)}`);
        return this.server.to(payload.room).emit('msgToClient', payload);
    }

    @SubscribeMessage('joinRoom')
    public joinRoom(client: Socket, room: string): void {
        client.join(room);
        client.emit('joinedRoom', room);
        this.logger.log(`JoinedRoom: ${client.id}`);
    }

    @SubscribeMessage('leaveRoom')
    public leaveRoom(client: Socket, room: string): void {
        client.leave(room);
        client.emit('leftRoom', room);
        this.logger.log(`leftRoom: ${client.id}`);
    }

    public afterInit(server: Server): void {
        return this.logger.log('ChatGateway initialized');
    }

    public handleDisconnect(client: Socket): void {
        return this.logger.log(`Client disconnected: ${client.id}`);
    }

    public handleConnection(client: Socket): void {
        return this.logger.log(`Client connected: ${client.id}`);
    }
}