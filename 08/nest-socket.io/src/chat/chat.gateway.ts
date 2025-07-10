import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log('socket id', client.id);

    const token = client.handshake.auth.token;

    if (!token) {
      return client.disconnect(true);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;

      this.server.emit('message', {
        username: 'System',
        text: `User ${client.data.user.username} joined the chat.`,
      });
    } catch (error) {
      return client.disconnect(true);
    }
  }

  @SubscribeMessage('chatMessage')
  chatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { text: string },
  ) {
    /*
     * this.server.emit() - all
     * socket.emit() - current socket
     * socket.broadcast.emit() - all except current
     * room
     * */

    this.server.emit('message', {
      username: client.data.user.username,
      text: message.text,
    });
    // client.emit("...", "...");
    // client.broadcast.emit("...","...");
  }
}
