// src/app.module.ts
import { Module } from '@nestjs/common';
import { RequisitionModule } from './requisition/requisition.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [RequisitionModule, ChatModule, AiModule, SeedModule],
})
export class AppModule {}
