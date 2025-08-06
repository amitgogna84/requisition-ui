// src/requisition/requisition.module.ts
import { Module } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { RequisitionController } from './requisition.controller';

@Module({
  controllers: [RequisitionController],
  providers: [RequisitionService],
})
export class RequisitionModule {}
