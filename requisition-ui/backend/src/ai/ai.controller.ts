import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async processChatQuery(@Body() body: { message: string }) {
    const response = await this.aiService.processQuery(body.message);
    return { response };
  }
} 