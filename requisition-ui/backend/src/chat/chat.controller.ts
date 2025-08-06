import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations() {
    return await this.chatService.getConversations();
  }

  @Get('conversations/:id')
  async getConversation(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.getConversation(id);
  }

  @Post('conversations')
  async createConversation(@Body() data: {
    title: string;
    vendorId: number;
    type: string;
    requisitionId?: number;
  }) {
    return await this.chatService.createConversation(data);
  }

  @Get('vendors')
  async getVendors() {
    return await this.chatService.getVendors();
  }

  @Get('vendors/:id')
  async getVendor(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.getVendor(id);
  }

  @Post('vendors')
  async createVendor(@Body() data: {
    name: string;
    email: string;
    company: string;
    skills: string[];
  }) {
    return await this.chatService.createVendor(data);
  }
} 