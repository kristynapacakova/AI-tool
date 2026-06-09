import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Chýbí ANTHROPIC_API_KEY.' }, { status: 500 });
    }

    const { clientName, businessDescription, brand, funnel } = await request.json();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: 'Jsi zkušený copywriter. Píšeš působivé marketingové texty v češtině. Odpovídáš VÝHRADNĚ validím JSON bez markdown.',
      messages: [{
        role: 'user',
        content: `Klient: ${clientName}\nByznys: ${businessDescription}\nBrand: ${JSON.stringify(brand)}\nFunnel: ${JSON.stringify(funnel)}\n\nVytvoř materiály. Vrať POUZE tento JSON:\n{\n  "socialPosts": [\n    "Celý text příspěvku pro Instagram/Facebook (5-8 řádků + emoji + hashtags)",\n    "Celý text druhého příspěvku (jiný úhel)",\n    "Celý text příspěvku pro LinkedIn (profesionální tón)"\n  ],\n  "emailSequence": {\n    "subject": "Předmět e-mailu",\n    "body": "Celý text e-mailu (6-8 odstavců, každý na novém řádku)"\n  },\n  "landingPage": {\n    "headline": "Hlavní nadpis (max 10 slov)",\n    "subheadline": "Podnadpis 1-2 věty",\n    "cta": "Text CTA (2-5 slov)",\n    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"]\n  },\n  "adCopy": [\n    "Celý text reklamy 1 (35-45 slov)",\n    "Celý text reklamy 2 (jiný angle)",\n    "Celý text reklamy 3 (benefit-orientovaný)"\n  ]\n}`,
      }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Chyba při generování materiálů' }, { status: 500 });
  }
}
