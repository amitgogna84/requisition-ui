// src/app.module.ts
import { Module } from '@nestjs/common';
import { RequisitionModule } from './requisition/requisition.module';

@Module({
  imports: [RequisitionModule],
})
export class AppModule {}
