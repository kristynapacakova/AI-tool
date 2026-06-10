'use client';

import { useState } from 'react';

interface BrandAnalysis {
  summary: string;
  toneOfVoice: { keywords: string[]; description: string };
  marketingAngle: { usp: string; communication: string };
  persona: { name: string; age: string; profession: string; painPoint: string; desires: string };
  extractedClientName: string;
  colors: string[];
  typography: { heading: string; body: string };
  images: string[];
}

interface FunnelStructure {
  tofu: { type: string; title: string; description: string; format: string };
  mofu: { type: string; sequence: string[]; goal: string };
  bofu: { cta: string; offer: string; urgency: string };
}

interface MarketingMaterials {
  socialPosts: { caption: string; image: string }[];
  emailSequence: { subject: string; body: string };
  landingPage: { headline: string; subheadline: string; cta: string; benefits: string[] };
  adCopy: string[];
}

type Step = 'input' | 'brand' | 'funnel' | 'materials';
type MaterialTab = 'social' | 'email' | 'landing' | 'ads';

const STEPS: { id: Step; label: string }[] = [
  { id: 'input', label: 'Web' },
  { id: 'brand', label: 'DNA značky' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'materials', label: 'Materiály' },
];
const STEP_INDEX: Record<Step, number> = { input: 0, brand: 1, funnel: 2, materials: 3 };

// ─── Demo generator ──────────────────────────────────────────────────

function extractDomain(url: string): string {
  try {
    const u = url.startsWith('http') ? url : `https://${url}`;
    return new URL(u).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const FONT_PAIRS: { heading: string; body: string }[] = [
  { heading: 'Playfair Display', body: 'Inter' },
  { heading: 'Poppins', body: 'Roboto' },
  { heading: 'Montserrat', body: 'Open Sans' },
  { heading: 'Space Grotesk', body: 'Inter' },
  { heading: 'Fraunces', body: 'Work Sans' },
];

function buildColors(seed: number): string[] {
  const hue = seed % 360;
  return [
    `hsl(${hue}, 75%, 55%)`,
    `hsl(${(hue + 40) % 360}, 25%, 35%)`,
    `hsl(${(hue + 200) % 360}, 60%, 60%)`,
    `hsl(0, 0%, 96%)`,
  ];
}

function buildImages(seed: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/400/400`);
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '??';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function buildBrand(name: string, url: string): BrandAnalysis {
  const domain = extractDomain(url);
  const n = name || domain;
  const seed = hashString(domain || n);
  return {
    extractedClientName: n,
    colors: buildColors(seed),
    typography: FONT_PAIRS[seed % FONT_PAIRS.length],
    images: buildImages(domain || n, 4),
    summary: `${n} je česká firma nabízející kvalitní produkty a služby. Zaměřuje se na budování dlouhodobých vztahů se zákazníky a důraz klade na spolehlivé výsledky.`,
    toneOfVoice: {
      keywords: ['důvěryhodný', 'profesionální', 'přátelský'],
      description: `Komunikace ${n} je přímá a srozumitelná, zaměřená na budování důvěry. Značka mluví jazykem svých klientů – bez zbytečného žargonu, s důrazem na konkrétní hodnotu a prokazatelné výsledky.`,
    },
    marketingAngle: {
      usp: `${n} řeší klíčový problém zákazníků rychleji a spolehlivěji než konkurence – bez zbytných komplikací.`,
      communication: `Hlavní sdělení staví na důvěře a prokazatelných výsledcích. Komunikujeme prostřednictvím příběhů spokojených zákazníků a konkrétních čísel, která přesvědčí i skeptické zájemce.`,
    },
    persona: {
      name: 'Tomáš Novák',
      age: '32–45 let',
      profession: 'Manažer nebo OSVČ s aktivním profesním životem',
      painPoint: `Nemá čas řešit problémy sám, hledá spolehlivého partnera, který věci vyřeší za něj na první pokus.`,
      desires: 'Chce klid v duši, úspöru času a partnera, kterému může věřit dlouhodobě.',
    },
  };
}

function buildFunnel(name: string): FunnelStructure {
  return {
    tofu: {
      type: 'Lead magnet',
      title: `Průvodce: 5 věcí, které musíte vědět před výběrem služby ${name}`,
      description: `Bezplatný PDF průvodce, který zákazníkovi zodpoví nejběžnější otázky a obavy ještě před prvním kontaktem. Filtruje nevhodné leady a přitáhne ty, kteří jsou připraveni jednat.`,
      format: 'PDF průvodce',
    },
    mofu: {
      type: 'E-mailová sekvence',
      sequence: [
        'E-mail 1 – Uvítání: Kdo jsme a proč jsme jiní než ostatní',
        'E-mail 2 – Příběh: Zákazník, který vyřešil svůj problém s naší pomocí',
        'E-mail 3 – Sociální důkaz: Výsledky a recenze od spokojených klientů',
      ],
      goal: 'Přeměnit studný lead na zařátý kontakt připravený k nákupu nebo konzultaci.',
    },
    bofu: {
      cta: 'Domluvit bezplatnou konzultaci',
      offer: 'Bezplatná 30minutová konzultace bez závazků – zjístíte přesně, jak vám pomůžeme',
      urgency: 'Termíny se obsazují rychle – zbývají pouze 3 volná místa tento týden',
    },
  };
}

function buildMaterials(name: string): MarketingMaterials {
  const captions = [
    `🎯 Víte, co odlišuje úspěšné firmy od průměrných?\n\nNe vždy je to produkt nebo cena. Většinou je to SPOLEHLIVOST.\n\nV ${name} jsme postavili celý byznys na jednom slibu: uděláme to správně na první pokus.\n\nA naši zákazníci to oceňují. 97 % z nich se vrací.\n\n👇 Zjištěte, jak to děláme – odkaz v biu.\n\n#spolehlivost #kvalita #business #česko`,
    `❓ Kolik vás stojí špatné rozhodnutí?\n\nSpoluprobírali jsme firmy, které to zjístily na vlastní kůži – a pak přišly za námi.\n\nNaše řešení:\n✅ Rychlá implementace\n✅ Žádné skryté poplatky\n✅ Výsledky, které vidíte\n\nNapište nám – první konzultace je zdarma.\n\n#podnikání #efektivita #výsledky`,
    `Hledáte partnera, ne jen dodavatele?\n\nU ${name} dostanete tým, který se chová jako součást vaší firmy. Rozumíme vašim cílům a přizpůsobujeme řešení tak, aby skutečně fungovalo.\n\nRádi si s vámi domlíme nezaváznou konzultaci.\n\n#spolupráce #byznyspartnertsví #rozvoj`,
    `📊 Čísla nelžou.\n\nZa poslední rok jsme pomohli desítkám klientů zvýšit konverze a snížit náklady na akvizici.\n\nChcete vidět, jak by to mohlo vypadat u vás? Napište nám „AUDIT\" do zprávy a pošleme vám bezplatnou analýzu.\n\n#data #růst #marketing`,
  ];
  return {
    socialPosts: captions.map((caption, i) => ({
      caption,
      image: `https://picsum.photos/seed/${name}-post-${i}/600/${i % 2 === 0 ? 750 : 500}`,
    })),
    emailSequence: {
      subject: `Vítáme vás – tady je váš průvodce od ${name}`,
      body: `Dobrý den,\n\nděkujeme, že jste se rozhodli zjístit více o ${name}. Jsme rádi, že jste tady.\n\nVíme, že váš čas je cenný, proto přejdeme rovnou k věci.\n\nCo pro vás v příštích dnech připravujeme:\n– Praktické tipy, které můžete využít hned\n– Příběhy klientů, kteří díky nám ušetřili čas i peníze\n– Exkluzivní nabídku pouze pro nové kontakty\n\nZačínáme ale jednou otázkou: co je váš největší problém, který byste chtěli vyřešit?\n\nOdpovězte přímo na tento e-mail – čteme každou zprávu a odpovídáme do 24 hodin.\n\nS pozdravem,\nTým ${name}`,
    },
    landingPage: {
      headline: `Výsledky, kterým můžete věřit`,
      subheadline: `${name} pomáhá firmám dosáhnout cílů rychleji, spolehlivěji a bez zbytečného stresu.`,
      cta: 'Získat bezplatnou konzultaci',
      benefits: [
        'Výsledky viditelné do 30 dní',
        'Žádné skryté poplatky ani překvapení',
        'Dedikovaný specialistá pro váš projekt',
        'Garance spokojenosti nebo vrácení peněz',
      ],
    },
    adCopy: [
      `Unavení z nespolehlivosti? ${name} garantuje výsledky nebo vrátíme peníze. Přes 500 spokojených klientů. Bezplatná konzultace – rezervujte si termín ještě dnes.`,
      `„Konečně firma, která drží slovo.“ – to říkají naši klienti. Zjištěte, jak ${name} pomohl firmám jako je ta vaše. Prvních 30 minut konzultace zdarma.`,
      `Ušetřete čas a nervy. ${name} přebírá starost za vás – od analýzy po výsledky. Bez složitých smluv. Začněte ještě dnes.`,
    ],
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── UI helpers ──────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs text-white/40 hover:text-violet-400 transition-colors flex items-center gap-1"
    >
      {copied ? '✓ Zkopírováno' : '⌘ Kopírovat'}
    </button>
  );
}

function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 bg-[#050811]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-card p-10 flex flex-col items-center gap-6 max-w-sm w-full text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{message}</p>
          <p className="text-white/40 text-sm mt-1">Zpracovávám data...</p>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const idx = STEP_INDEX[current];
  return (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            i < idx ? 'bg-violet-500/20 text-violet-400' : i === idx ? 'bg-violet-500 text-white' : 'bg-white/5 text-white/30'
          }`}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/10">
              {i < idx ? '✓' : i + 1}
            </span>
            {s.label}
          </div>
          {i < STEPS.length - 1 && <span className={`mx-1 text-xs ${i < idx ? 'text-violet-400/60' : 'text-white/20'}`}>→</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────

export default function Home() {
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [activeTab, setActiveTab] = useState<MaterialTab>('social');

  const [websiteUrl, setWebsiteUrl] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [clientName, setClientName] = useState('');
  const [brand, setBrand] = useState<BrandAnalysis | null>(null);
  const [funnel, setFunnel] = useState<FunnelStructure | null>(null);
  const [materials, setMaterials] = useState<MarketingMaterials | null>(null);

  const displayName = clientName || brand?.extractedClientName || extractDomain(websiteUrl);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setLoadingMsg('Načítám web a analyzuji značku...');
    await sleep(2500);
    const b = buildBrand(clientName, websiteUrl);
    setBrand(b);
    if (!clientName) setClientName(b.extractedClientName);
    setLoading(false); setStep('brand');
  };

  const handleFunnel = async () => {
    setLoading(true); setLoadingMsg('Navrhuji funnel strukturu...');
    await sleep(1800);
    setFunnel(buildFunnel(displayName));
    setLoading(false); setStep('funnel');
  };

  const handleMaterials = async () => {
    setLoading(true); setLoadingMsg('Generuji marketingové materiály...');
    await sleep(2200);
    setMaterials(buildMaterials(displayName));
    setLoading(false); setStep('materials'); setActiveTab('social');
  };

  const handleReset = () => {
    setStep('input'); setBrand(null); setFunnel(null); setMaterials(null);
    setWebsiteUrl(''); setAdditionalContext(''); setClientName('');
  };

  return (
    <main className="min-h-screen bg-[#050811] relative">
      {loading && <LoadingOverlay message={loadingMsg} />}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-4">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            Vibe Business Platform
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Marketing{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI Stratég</span>
          </h1>
          <p className="text-white/40 text-sm">Zadejte URL klienta – automaticky vytvoříme DNA značky, funnel a marketingové materiály</p>
        </header>

        <div className="mb-6 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
          <span className="text-amber-400 text-sm">⚡</span>
          <span className="text-amber-300/80 text-xs">Demo režim – ukázková data na základě URL. Pro výsledky napojte AI API.</span>
        </div>

        <StepIndicator current={step} />

        {/* STEP 1 – INPUT */}
        {step === 'input' && (
          <form onSubmit={handleAnalyze} className="glass-card p-8 flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Web klienta</h2>
              <p className="text-white/40 text-sm">Zadejte URL a automaticky získáte kompletní marketingovou strategii</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">URL webu klienta</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">https://</span>
                <input
                  className="input-field pl-16"
                  placeholder="domovniguru.cz"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">
                Název klienta <span className="text-white/30">(nepovinné – auto-detekce z domény)</span>
              </label>
              <input
                className="input-field"
                placeholder="např. Domovni Guru"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">
                Doplňující kontext <span className="text-white/30">(nepovinné)</span>
              </label>
              <textarea
                className="input-field resize-none" rows={3}
                placeholder="např. klient chce cílit na Prahu, rozpočet 50 000 Kč/měsíc na reklamu..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              🔍 Analyzovat značku →
            </button>
          </form>
        )}

        {/* STEP 2 – BRAND */}
        {step === 'brand' && brand && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-white">{displayName}</h2><p className="text-sm text-white/40">DNA značky</p></div>
              <button onClick={() => setStep('input')} className="text-sm text-white/40 hover:text-white transition-colors">← Zpět</button>
            </div>
            {brand.summary && (
              <div className="glass-card p-4 flex items-start gap-3">
                <span className="text-lg">🌐</span>
                <p className="text-white/70 text-sm leading-relaxed">{brand.summary}</p>
              </div>
            )}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4"><span className="text-xl">🧬</span><h3 className="font-bold text-white">DNA značky</h3></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div className="flex flex-col items-center justify-center gap-2 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-[#050811]" style={{ background: brand.colors[0] }}>
                    {getInitials(displayName)}
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Logo</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-3xl font-bold text-white">Aa</p>
                  <p className="text-[10px] text-white/40">{brand.typography.heading}</p>
                </div>
                <div className="flex flex-col justify-center gap-1.5 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Barvy</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {brand.colors.map((c, i) => <div key={i} className="h-6 rounded-md" style={{ background: c }} />)}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <span className="text-2xl">🇨🇿</span>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Čeština</p>
                </div>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Vizuální inspirace</p>
              <div className="grid grid-cols-4 gap-2">
                {brand.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded-lg" />
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4"><span className="text-xl">🎯</span><h3 className="font-bold text-white">Tone of Voice</h3></div>
              <div className="flex flex-wrap gap-2 mb-3">
                {brand.toneOfVoice.keywords.map((kw) => (
                  <span key={kw} className="bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full">{kw}</span>
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{brand.toneOfVoice.description}</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4"><span className="text-xl">⚡</span><h3 className="font-bold text-white">Marketingový úhel</h3></div>
              <p className="text-white font-semibold mb-2">{brand.marketingAngle.usp}</p>
              <p className="text-white/70 text-sm leading-relaxed">{brand.marketingAngle.communication}</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4"><span className="text-xl">👤</span><h3 className="font-bold text-white">Ideální persona</h3></div>
              <div className="grid grid-cols-2 gap-3">
                {([['Jméno', brand.persona.name], ['Věk', brand.persona.age]] as [string,string][]).map(([l, v]) => (
                  <div key={l}><p className="text-xs text-white/40 uppercase tracking-wider mb-1">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
                ))}
                {([['Povolání', brand.persona.profession], ['Hlavní problém', brand.persona.painPoint], ['Co hledá', brand.persona.desires]] as [string,string][]).map(([l, v]) => (
                  <div key={l} className="col-span-2"><p className="text-xs text-white/40 uppercase tracking-wider mb-1">{l}</p><p className="text-white/80 text-sm">{v}</p></div>
                ))}
              </div>
            </div>
            <button onClick={handleFunnel} className="btn-primary w-full">Schválit a navrhnout funnel →</button>
          </div>
        )}

        {/* STEP 3 – FUNNEL */}
        {step === 'funnel' && funnel && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-white">{displayName}</h2><p className="text-sm text-white/40">Funnel struktura</p></div>
              <button onClick={() => setStep('brand')} className="text-sm text-white/40 hover:text-white transition-colors">← Zpět</button>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><span className="text-xl">👁️</span><span className="text-xs font-semibold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20">TOFU – Povědomí</span></div>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-lg">{funnel.tofu.format}</span>
              </div>
              <h3 className="font-bold text-white mb-2">{funnel.tofu.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{funnel.tofu.description}</p>
            </div>
            <div className="flex justify-center text-white/30 text-xl">↓</div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3"><span className="text-xl">💡</span><span className="text-xs font-semibold text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/20">MOFU – Zájem</span></div>
              <ul className="flex flex-col gap-2 mb-3">
                {funnel.mofu.sequence.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-white/70"><span className="text-violet-400 shrink-0 mt-0.5">▸</span>{s}</li>)}
              </ul>
              <p className="text-xs text-white/40 italic">Cíl: {funnel.mofu.goal}</p>
            </div>
            <div className="flex justify-center text-white/30 text-xl">↓</div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3"><span className="text-xl">🎯</span><span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">BOFU – Konverze</span></div>
              <div className="flex flex-col gap-3">
                {([['CTA', funnel.bofu.cta], ['Nabídka', funnel.bofu.offer], ['Urgence', funnel.bofu.urgency]] as [string,string][]).map(([l, v]) => (
                  <div key={l}><p className="text-xs text-white/40 uppercase tracking-wider mb-1">{l}</p><p className="text-white/80 text-sm">{v}</p></div>
                ))}
              </div>
            </div>
            <button onClick={handleMaterials} className="btn-primary w-full">Generovat marketingové materiály →</button>
          </div>
        )}

        {/* STEP 4 – MATERIALS */}
        {step === 'materials' && materials && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-white">{displayName}</h2><p className="text-sm text-white/40">Marketingové materiály</p></div>
              <button onClick={() => setStep('funnel')} className="text-sm text-white/40 hover:text-white transition-colors">← Zpět</button>
            </div>
            <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
              {(['social','email','landing','ads'] as MaterialTab[]).map((tab) => {
                const labels: Record<MaterialTab,string> = { social:'📱 Social', email:'📧 E-mail', landing:'🖥️ Landing', ads:'📢 Reklamy' };
                return <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${activeTab===tab?'bg-violet-500/25 text-violet-300 border border-violet-500/30':'text-white/40 hover:text-white/70'}`}>{labels[tab]}</button>;
              })}
            </div>
            {activeTab==='social' && (
              <div className="columns-2 sm:columns-3 gap-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
                {materials.socialPosts.map((p, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <img src={p.image} alt="" className="w-full object-cover" />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-white/50">Post {i+1}</span><CopyButton text={p.caption} /></div>
                      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line line-clamp-6">{p.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab==='email' && (
              <div className="glass-card p-6 flex flex-col gap-4">
                <div><div className="flex items-center justify-between mb-1"><p className="text-xs text-white/40 uppercase tracking-wider">Předmět</p><CopyButton text={materials.emailSequence.subject} /></div><p className="text-white font-semibold">{materials.emailSequence.subject}</p></div>
                <div className="h-px bg-white/5" />
                <div><div className="flex items-center justify-between mb-2"><p className="text-xs text-white/40 uppercase tracking-wider">Text</p><CopyButton text={materials.emailSequence.body} /></div><p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{materials.emailSequence.body}</p></div>
              </div>
            )}
            {activeTab==='landing' && (
              <div className="glass-card p-6 flex flex-col gap-5">
                <div><div className="flex items-center justify-between mb-1"><p className="text-xs text-white/40 uppercase tracking-wider">Hlavní nadpis</p><CopyButton text={materials.landingPage.headline} /></div><p className="text-2xl font-bold text-white">{materials.landingPage.headline}</p></div>
                <div><p className="text-xs text-white/40 uppercase tracking-wider mb-1">Podnadpis</p><p className="text-white/70">{materials.landingPage.subheadline}</p></div>
                <div><p className="text-xs text-white/40 uppercase tracking-wider mb-2">CTA</p><span className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl">{materials.landingPage.cta}</span></div>
                <div><p className="text-xs text-white/40 uppercase tracking-wider mb-2">Benefity</p><ul className="flex flex-col gap-2">{materials.landingPage.benefits.map((b,i) => <li key={i} className="flex items-center gap-2 text-sm text-white/80"><span className="text-emerald-400">✓</span>{b}</li>)}</ul></div>
              </div>
            )}
            {activeTab==='ads' && <div className="flex flex-col gap-4">{materials.adCopy.map((ad,i) => <div key={i} className="glass-card p-5"><div className="flex items-center justify-between mb-3"><span className="text-xs font-semibold text-white/50">Reklama {i+1}</span><CopyButton text={ad} /></div><p className="text-sm text-white/80 leading-relaxed">{ad}</p></div>)}</div>}
            <button onClick={handleReset} className="btn-primary w-full mt-2">+ Nový klient</button>
          </div>
        )}
      </div>
    </main>
  );
}
