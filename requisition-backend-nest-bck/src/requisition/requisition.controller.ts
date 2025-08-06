// src/requisition/requisition.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { RequisitionService } from './requisition.service';

@Controller('requisition')
export class RequisitionController {
  constructor(private readonly requisitionService: RequisitionService) {}

  @Post()
  async create(@Body() body: { title: string; description: string; budget: number }) {
    return this.requisitionService.create(body);
  }
}
