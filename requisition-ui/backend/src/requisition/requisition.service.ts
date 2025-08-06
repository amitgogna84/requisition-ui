import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

@Injectable()
export class RequisitionService {
  async create(data: { title: string; description: string; budget: number }) {
    const enrichedJD = await this.callGemini(data);

    return await prisma.requisition.create({
      data: {
        ...data,
        enrichedJD,
      },
    });
  }

  private async callGemini(data: {
    title: string;
    description: string;
  }): Promise<string> {
    const prompt = `Suggest important skills and JD refinements for the role: ${data.title}. Description: ${data.description}`;

    const response = await axios.post<{
      candidates?: {
        content?: {
          parts?: { text: string }[];
        };
      }[];
    }>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';

    return generatedText;
  }
}