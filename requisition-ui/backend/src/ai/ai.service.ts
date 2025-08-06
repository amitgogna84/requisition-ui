import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text: string }[];
    };
  }[];
}

@Injectable()
export class AiService {
  async processQuery(userQuery: string): Promise<string> {
    try {
      // First, analyze the query to understand what the user is asking for
      const queryAnalysis = await this.analyzeQuery(userQuery);
      
      // Get relevant data based on the query type
      const data = await this.getRelevantData(queryAnalysis);
      
      // Generate AI response using the data
      const response = await this.generateResponse(userQuery, queryAnalysis, data);
      
      return response;
    } catch (error) {
      console.error('Error processing query:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again.";
    }
  }

  private async analyzeQuery(query: string): Promise<{
    type: 'vendor_info' | 'rate_cards' | 'consultants' | 'contracts' | 'services' | 'comparison' | 'general';
    entities: string[];
    intent: string;
  }> {
    const prompt = `Analyze this query about IT services vendors and classify it:
Query: "${query}"

Respond with JSON format only (no markdown formatting):
{
  "type": "vendor_info|rate_cards|consultants|contracts|services|comparison|general",
  "entities": ["list", "of", "relevant", "entities"],
  "intent": "brief description of what user wants"
}

Types:
- vendor_info: Questions about vendor companies, profiles, details
- rate_cards: Questions about pricing, rates, costs
- consultants: Questions about individual consultants, skills, availability
- contracts: Questions about existing contracts, terms, values
- services: Questions about service offerings, capabilities
- comparison: Questions comparing vendors, rates, services
- general: General questions about IT services

Return only valid JSON, no markdown formatting.`;

    const response = await axios.post<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Clean the response to extract JSON
    let jsonString = result || '{"type":"general","entities":[],"intent":"general inquiry"}';
    
    // Remove markdown formatting if present
    jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        type: 'general',
        entities: [],
        intent: 'general inquiry'
      };
    }
  }

  private async getRelevantData(analysis: any): Promise<any> {
    const { type, entities } = analysis;
    
    switch (type) {
      case 'vendor_info':
        return await prisma.vendor.findMany({
          include: {
            rateCards: true,
            consultants: true,
            contracts: true,
            services: true,
          },
        });
        
      case 'rate_cards':
        return await prisma.rateCard.findMany({
          include: {
            vendor: true,
          },
        });
        
      case 'consultants':
        return await prisma.consultant.findMany({
          include: {
            vendor: true,
          },
        });
        
      case 'contracts':
        return await prisma.contract.findMany({
          include: {
            vendor: true,
          },
        });
        
      case 'services':
        return await prisma.service.findMany({
          include: {
            vendor: true,
          },
        });
        
      case 'comparison':
        return await prisma.vendor.findMany({
          include: {
            rateCards: true,
            consultants: true,
            contracts: true,
            services: true,
          },
        });
        
      default:
        return await prisma.vendor.findMany({
          include: {
            rateCards: true,
            consultants: true,
            contracts: true,
            services: true,
          },
        });
    }
  }

  private async generateResponse(
    userQuery: string, 
    analysis: any, 
    data: any
  ): Promise<string> {
    const dataContext = JSON.stringify(data, null, 2);
    
    const prompt = `You are an AI assistant for an IT services vendor management system. 
    
User Query: "${userQuery}"
Query Analysis: ${JSON.stringify(analysis)}

Available Data: ${dataContext}

Provide a helpful, conversational response that:
1. Directly answers the user's question
2. Uses the available data to provide specific information
3. Maintains a professional but friendly tone
4. If no specific data is available, suggest what information might be helpful
5. Format any pricing information clearly
6. Keep the response concise but informative

Respond in a natural, conversational way as if you're a helpful assistant.`;

    const response = await axios.post<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
           "I'm sorry, I couldn't generate a response at this time. Please try again.";
  }
} 