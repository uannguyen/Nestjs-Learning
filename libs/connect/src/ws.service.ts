import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway(9999, {
  transports: ['websocket'],
})
export class WsService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');
  private clients = {};

  @SubscribeMessage('message')
  public handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<WsResponse<any>> {
    console.log('send message', payload);
    payload.client_id = client.id;
    this.server.sockets.emit('receive_message', payload);
    return;
  }

  @SubscribeMessage('private-message')
  public handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<WsResponse<any>> {
    const { to, message } = payload;
    this.server.to(to).emit('private-message', { message, from: client.id });
    return;
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, data): void {
    const { room } = data;
    console.log('joinRoom', room);
    client.join(room);
    client.to(room).emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    console.log('leaveRoom', room);
    client.leave(room);
    client.emit('leftRoom', room);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket & any): void {
    this.logger.log(`Client connected: ${client.id}`);
    client.username = client.handshake?.auth?.username;
    const users = [];

    for (const [id, socket] of (this.server as any).of('/').sockets) {
      users.push({
        userID: id,
        username: socket.username,
        connected: true,
      });
    }

    this.server.emit('users', users);

    // notify existing users
    client.broadcast.emit('user-connected', {
      userID: client.id,
      username: client.username,
    });
  }
}
