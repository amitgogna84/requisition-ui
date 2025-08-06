import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"], // Allow both ports
    credentials: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = data;
    client.join(`conversation_${conversationId}`);
    
    // Send conversation history
    const messages = await this.chatService.getConversationMessages(conversationId);
    client.emit('conversationHistory', messages);
    
    return { status: 'joined', conversationId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { 
      conversationId: number; 
      content: string; 
      senderType: 'user' | 'vendor';
      vendorId?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId, content, senderType, vendorId } = data;
    
    // Save message to database
    const message = await this.chatService.createMessage({
      conversationId,
      content,
      senderType,
      vendorId,
    });

    // Broadcast to all clients in the conversation
    this.server.to(`conversation_${conversationId}`).emit('newMessage', message);
    
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: number; isTyping: boolean; senderType: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId, isTyping, senderType } = data;
    client.to(`conversation_${conversationId}`).emit('userTyping', { isTyping, senderType });
  }
} 