import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Chýbí ANTHROPIC_API_KEY.' }, { status: 500 });
    }

    const { clientName, businessDescription, brand } = await request.json();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: 'Jsi expert na prodejní funnely. Odpovídáš VÝHRADNĚ validím JSON. Vše v češtině.',
      messages: [{
        role: 'user',
        content: `Klient: ${clientName}\nByznys: ${businessDescription}\nBrand: ${JSON.stringify(brand)}\n\nVrať POUZE tento JSON:\n{\n  "tofu": {\n    "type": "typ obsahu",\n    "title": "název obsahu",\n    "description": "proč zákazníka zaujme (2-3 věty)",\n    "format": "formát (PDF / webinar / checklist / video)"\n  },\n  "mofu": {\n    "type": "typ nurturing obsahu",\n    "sequence": ["E-mail 1 - popis", "E-mail 2 - popis", "E-mail 3 - popis"],\n    "goal": "cíl MOFU fáze"\n  },\n  "bofu": {\n    "cta": "výzva k akci",\n    "offer": "konkrétní nabídka",\n    "urgency": "prvek urgence nebo sociální důkaz"\n  }\n}`,
      }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Chyba při generování funnelu' }, { status: 500 });
  }
}
