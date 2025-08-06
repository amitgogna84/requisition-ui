import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  async createMessage(data: {
    conversationId: number;
    content: string;
    senderType: 'user' | 'vendor';
    vendorId?: number;
  }) {
    return await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        content: data.content,
        senderType: data.senderType,
        vendorId: data.vendorId,
        messageType: 'text',
      },
      include: {
        vendor: true,
        conversation: {
          include: {
            vendor: true,
          },
        },
      },
    });
  }

  async getConversationMessages(conversationId: number) {
    return await prisma.message.findMany({
      where: { conversationId },
      include: {
        vendor: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createConversation(data: {
    title: string;
    vendorId: number;
    type: string;
    requisitionId?: number;
  }) {
    return await prisma.conversation.create({
      data: {
        title: data.title,
        vendorId: data.vendorId,
        type: data.type,
        requisitionId: data.requisitionId,
      },
      include: {
        vendor: true,
        requisition: true,
      },
    });
  }

  async getConversations() {
    return await prisma.conversation.findMany({
      include: {
        vendor: true,
        requisition: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(conversationId: number) {
    return await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        vendor: true,
        requisition: true,
        messages: {
          include: {
            vendor: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async createVendor(data: {
    name: string;
    email: string;
    company: string;
    skills: string[];
  }) {
    return await prisma.vendor.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        skills: data.skills,
      },
    });
  }

  async getVendors() {
    return await prisma.vendor.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVendor(vendorId: number) {
    return await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });
  }
} 