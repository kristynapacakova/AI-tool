'use client';

import { useState } from 'react';

interface BrandAnalysis {
  toneOfVoice: { keywords: string[]; description: string };
  marketingAngle: { usp: string; communication: string };
  persona: { name: string; age: string; profession: string; painPoint: string; desires: string };
}

interface FunnelStructure {
  tofu: { type: string; title: string; description: string; format: string };
  mofu: { type: string; sequence: string[]; goal: string };
  bofu: { cta: string; offer: string; urgency: string };
}

interface MarketingMaterials {
  socialPosts: string[];
  emailSequence: { subject: string; body: string };
  landingPage: { headline: string; subheadline: string; cta: string; benefits: string[] };
  adCopy: string[];
}

type Step = 'input' | 'brand' | 'funnel' | 'materials';
type MaterialTab = 'social' | 'email' | 'landing' | 'ads';

const STEPS: { id: Step; label: string }[] = [
  { id: 'input', label: 'Vstup' },
  { id: 'brand', label: 'Značka' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'materials', label: 'Materiály' },
];

const STEP_INDEX: Record<Step, number> = { input: 0, brand: 1, funnel: 2, materials: 3 };

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
          <p className="text-white/40 text-sm mt-1">AI zpracovává data...</p>
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

export default function Home() {
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MaterialTab>('social');
  const [clientName, setClientName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [brand, setBrand] = useState<BrandAnalysis | null>(null);
  const [funnel, setFunnel] = useState<FunnelStructure | null>(null);
  const [materials, setMaterials] = useState<MarketingMaterials | null>(null);

  async function callApi<T>(url: string, body: object, msg: string): Promise<T> {
    setLoading(true); setLoadingMsg(msg); setError(null);
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Neznámá chyba');
    return data as T;
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await callApi<BrandAnalysis>('/api/analyze', { clientName, businessDescription: businessDesc }, 'Analyzuji značku...');
      setBrand(data); setStep('brand');
    } catch (err) { setError(err instanceof Error ? err.message : 'Chyba'); }
    finally { setLoading(false); }
  };

  const handleFunnel = async () => {
    try {
      const data = await callApi<FunnelStructure>('/api/funnel', { clientName, businessDescription: businessDesc, brand }, 'Navrhuji funnel strukturu...');
      setFunnel(data); setStep('funnel');
    } catch (err) { setError(err instanceof Error ? err.message : 'Chyba'); }
    finally { setLoading(false); }
  };

  const handleMaterials = async () => {
    try {
      const data = await callApi<MarketingMaterials>('/api/materials', { clientName, businessDescription: businessDesc, brand, funnel }, 'Generuji marketingové materiály...');
      setMaterials(data); setStep('materials'); setActiveTab('social');
    } catch (err) { setError(err instanceof Error ? err.message : 'Chyba'); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setStep('input'); setBrand(null); setFunnel(null); setMaterials(null);
    setClientName(''); setBusinessDesc(''); setError(null);
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
          <p className="text-white/40 text-sm">Kompletní brand &amp; funnel analýza poháněná AI</p>
        </header>

        <StepIndicator current={step} />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1 – INPUT */}
        {step === 'input' && (
          <form onSubmit={handleAnalyze} className="glass-card p-8 flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Nový klient</h2>
              <p className="text-white/40 text-sm">Zadejte informace o byznysu klienta</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Název klienta / projektu</label>
              <input className="input-field" placeholder="např. Kavárna U Modrého koně" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Popis byznysu / nápadu</label>
              <textarea
                className="input-field resize-none" rows={7}
                placeholder="Popište co nejdetailněji byznys klienta: co prodává, pro koho, jaký problém řeší, region / online, cenová hladina, co ho odlišuje od konkurence..."
                value={businessDesc} onChange={(e) => setBusinessDesc(e.target.value)} required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">Analyzovat značku →</button>
          </form>
        )}

        {/* STEP 2 – BRAND */}
        {step === 'brand' && brand && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-white">{clientName}</h2><p className="text-sm text-white/40">Brand analýza</p></div>
              <button onClick={() => setStep('input')} className="text-sm text-white/40 hover:text-white transition-colors">← Zpět</button>
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
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[['Jméno', brand.persona.name], ['Věk', brand.persona.age]].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white text-sm font-medium">{val}</p>
                  </div>
                ))}
                <div className="col-span-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Provolání</p>
                  <p className="text-white text-sm font-medium">{brand.persona.profession}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Hlavní problém</p>
                  <p className="text-white/80 text-sm">{brand.persona.painPoint}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Co hledá</p>
                  <p className="text-white/80 text-sm">{brand.persona.desires}</p>
                </div>
              </div>
            </div>
            <button onClick={handleFunnel} disabled={loading} className="btn-primary w-full">Schválit a navrhnout funnel →</button>
          </div>
        )}

        {/* STEP 3 – FUNNEL */}
        {step === 'funnel' && funnel && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-white">{clientName}</h2><p className="text-sm text-white/40">Funnel struktura</p></div>
              <button onClick={() => setStep('brand')} className="text-sm text-white/40 hover:text-white transition-colors">← Zpět</button>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👁️</span>
                  <span className="text-xs font-semibold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20">TOFU – Povědomí</span>
                </div>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-lg">{funnel.tofu.format}</span>
              </div>
              <h3 className="font-bold text-white mb-2">{funnel.tofu.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{funnel.tofu.description}</p>
            </div>
            <div className="flex justify-center text-white/30 text-xl">↓</div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💡</span>
                <span className="text-xs font-semibold text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/20">MOFU – Zájem</span>
              </div>
              <ul className="flex flex-col gap-2 mb-3">
                {funnel.mofu.sequence.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70"><span className="text-violet-400 shrink-0 mt-0.5">▸</span>{s}</li>
                ))}
              </ul>
              <p className="text-xs text-white/40 italic">Cíl: {funnel.mofu.goal}</p>
            </div>
            <div className="flex justify-center text-white/30 text-xl">↓</div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎯</span>
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">BOFU – Konverze</span>
              </div>
              <div className="flex flex-col gap-3">
                {[['CTA', funnel.bofu.cta], ['Nabídka', funnel.bofu.offer], ['Urgence / Důvěra', funnel.bofu.urgency]].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white/80 text-sm">{val}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleMaterials} disabled={loading} className="btn-primary w-full">Generovat marketingové materiály →</button>
          </div>
        )}

        {/* STEP 4 – MATERIALS */}
        {step === 'materials' && materials && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-white">{clientName}</h2><p className="text-sm text-white/40">Marketingové materiály</p></div>
              <button onClick={() => setStep('funnel')} className="text-sm text-white/40 hover:text-white transition-colors">← Zpět</button>
            </div>
            <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
              {(['social', 'email', 'landing', 'ads'] as MaterialTab[]).map((tab) => {
                const labels: Record<MaterialTab, string> = { social: '📱 Social', email: '📧 E-mail', landing: '🖥️ Landing', ads: '📢 Reklamy' };
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab ? 'bg-violet-500/25 text-violet-300 border border-violet-500/30' : 'text-white/40 hover:text-white/70'
                  }`}>{labels[tab]}</button>
                );
              })}
            </div>

            {activeTab === 'social' && (
              <div className="flex flex-col gap-4">
                {materials.socialPosts.map((post, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-white/50">Post {i + 1}</span>
                      <CopyButton text={post} />
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{post}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'email' && (
              <div className="glass-card p-6 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Předmět</p>
                    <CopyButton text={materials.emailSequence.subject} />
                  </div>
                  <p className="text-white font-semibold">{materials.emailSequence.subject}</p>
                </div>
                <div className="h-px bg-white/5" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Text e-mailu</p>
                    <CopyButton text={materials.emailSequence.body} />
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{materials.emailSequence.body}</p>
                </div>
              </div>
            )}

            {activeTab === 'landing' && (
              <div className="glass-card p-6 flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Hlavní nadpis</p>
                    <CopyButton text={materials.landingPage.headline} />
                  </div>
                  <p className="text-2xl font-bold text-white">{materials.landingPage.headline}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Podnadpis</p>
                  <p className="text-white/70">{materials.landingPage.subheadline}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">CTA tlačítko</p>
                  <span className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl">{materials.landingPage.cta}</span>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Benefity</p>
                  <ul className="flex flex-col gap-2">
                    {materials.landingPage.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80"><span className="text-emerald-400">✓</span>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'ads' && (
              <div className="flex flex-col gap-4">
                {materials.adCopy.map((ad, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-white/50">Reklama {i + 1}</span>
                      <CopyButton text={ad} />
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{ad}</p>
                  </div>
                ))}
              </div>
            )}

            <button onClick={handleReset} className="btn-primary w-full mt-2">+ Nový klient</button>
          </div>
        )}
      </div>
    </main>
  );
}
