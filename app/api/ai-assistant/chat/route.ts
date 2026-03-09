import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const zai = await ZAI.create();

    // Convert messages to the format expected by the SDK
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful procurement AI assistant. You help users with procurement-related questions, including supplier management, contract analysis, spend analysis, category management, and RFx events. Provide clear, actionable insights and recommendations based on the user\'s requests.',
        },
        ...formattedMessages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';

    return NextResponse.json({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', message: error.message },
      { status: 500 }
    );
  }
}
