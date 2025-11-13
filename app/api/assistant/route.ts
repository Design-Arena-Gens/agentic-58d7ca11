import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAssistantResponse } from '@/lib/assistant';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string()
});

const requestSchema = z.object({
  message: z.string(),
  history: z.array(messageSchema).optional(),
  context: z
    .object({
      subject: z.string().optional(),
      goal: z.string().optional(),
      examDate: z.string().optional(),
      gradeLevel: z.string().optional(),
      learningStyle: z.string().optional(),
      timePerDay: z.number().optional(),
      daysAvailable: z.number().optional()
    })
    .optional(),
  mode: z.enum(['chat', 'plan', 'check-in']).optional()
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = requestSchema.parse(payload);
    const response = generateAssistantResponse(parsed);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Assistant API error', error);
    return NextResponse.json(
      {
        error: 'Unable to process your request. Please adjust your message and retry.'
      },
      { status: 400 }
    );
  }
}
