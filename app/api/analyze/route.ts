import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

async function fetchWebsiteContent(rawUrl: string): Promise<{ content: string; domain: string }> {
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VibeBusiness/1.0)' },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`Web vrátil chybu ${res.status}`);

  const html = await res.text();

  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) ?? [])[1]?.trim() ?? '';
  const metaDesc = (
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ??
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ??
    []
  )[1]?.trim() ?? '';

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000);

  const domain = new URL(url).hostname.replace('www.', '');

  const content = [
    `URL: ${url}`,
    title && `Název stránky: ${title}`,
    metaDesc && `Meta popis: ${metaDesc}`,
    `Obsah webu:\n${text}`,
  ].filter(Boolean).join('\n\n');

  return { content, domain };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Chýbí ANTHROPIC_API_KEY. Přidejte ho do Vercel → Settings → Environment Variables.' },
        { status: 500 }
      );
    }

    const { websiteUrl, clientName, additionalContext } = await request.json();

    let siteContent = '';
    let detectedName = clientName ?? '';

    if (websiteUrl) {
      const { content, domain } = await fetchWebsiteContent(websiteUrl);
      siteContent = content;
      if (!detectedName) detectedName = domain;
    }

    const contextBlock = [
      siteContent,
      additionalContext ? `Doplňující kontext: ${additionalContext}` : '',
    ].filter(Boolean).join('\n\n');

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1800,
      system: 'Jsi expert na marketing a brandání. Analyzuješ weby a extrahujiš brand DNA. Odpovídáš VÝHRADNĚ validím JSON bez markdown. Vše v češtině.',
      messages: [{
        role: 'user',
        content: `Klient: ${detectedName}\n\n${contextBlock}\n\nNa základě obsahu webu vytvoř brand analýzu. Vrať POUZE tento JSON:\n{\n  "summary": "1-2 věty popis činnosti klienta",\n  "toneOfVoice": {\n    "keywords": ["adj1", "adj2", "adj3"],\n    "description": "2-3 věty o komunikačním stylu značky"\n  },\n  "marketingAngle": {\n    "usp": "Hlavní USP v 1 větě",\n    "communication": "Jak USP komunikovat (2-3 věty)"\n  },\n  "persona": {\n    "name": "Fiktivní jméno",\n    "age": "Věkové rozpětí",\n    "profession": "Povolání a životní situace",\n    "painPoint": "Hlavní problém který řeší",\n    "desires": "Co hledá a co mu přinese spokojenost"\n  }\n}`,
      }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ ...parsed, extractedClientName: detectedName });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chyba při analýze' },
      { status: 500 }
    );
  }
}
