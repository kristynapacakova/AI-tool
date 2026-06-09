import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Chýbí ANTHROPIC_API_KEY. Přidejte ho do Vercel → Settings → Environment Variables.' },
        { status: 500 }
      );
    }

    const { clientName, businessDescription } = await request.json();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: 'Jsi expert na marketing a brandání. Odpovídáš VÝHRADNĚ validím JSON bez markdown bloků, komentářů nebo jiného textu. Vše v češtině.',
      messages: [{
        role: 'user',
        content: `Klient: ${clientName}\nPopis byznysu: ${businessDescription}\n\nVrať POUZE tento JSON:\n{\n  "toneOfVoice": {\n    "keywords": ["adj1", "adj2", "adj3"],\n    "description": "2-3 věty o komunikačním stylu značky"\n  },\n  "marketingAngle": {\n    "usp": "Hlavní USP v 1 větě",\n    "communication": "Jak USP komunikovat (2-3 věty)"\n  },\n  "persona": {\n    "name": "Fiktivní jméno",\n    "age": "Rozpětí věku (např. 28-38 let)",\n    "profession": "Povolání a životní situace",\n    "painPoint": "Hlavní problém který řeší",\n    "desires": "Co hledá a co mu přinese spokojenost"\n  }\n}`,
      }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Chyba při analýze' }, { status: 500 });
  }
}
