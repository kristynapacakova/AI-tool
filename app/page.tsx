'use client';

import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Category =
  | 'eshop'
  | 'restaurace'
  | 'fitness'
  | 'vzdelavani'
  | 'reality'
  | 'it'
  | 'kosmetika'
  | 'zdravotnictvi';

type AppState = 'form' | 'loading' | 'results';

interface FunnelFormData {
  businessName: string;
  category: Category;
  description: string;
  targetAudience: string;
}

interface FunnelContent {
  awareness: {
    headline: string;
    socialPost: string;
    adCopy: string[];
  };
  interest: {
    emailSubject: string;
    emailBody: string;
    blogTopics: string[];
  };
  conversion: {
    cta: string;
    landingHeadline: string;
    valuePropositions: string[];
  };
}

// ─── Category config ─────────────────────────────────────────────────────────

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'eshop', label: 'E-shop / Maloobchod', icon: '🛍️' },
  { value: 'restaurace', label: 'Restaurace / Kavárna', icon: '🍽️' },
  { value: 'fitness', label: 'Fitness / Wellness', icon: '💪' },
  { value: 'vzdelavani', label: 'Vzdělávání / Kurzy', icon: '📚' },
  { value: 'reality', label: 'Reality / Nemovitosti', icon: '🏠' },
  { value: 'it', label: 'IT / Software', icon: '💻' },
  { value: 'kosmetika', label: 'Kosmetika / Krása', icon: '✨' },
  { value: 'zdravotnictvi', label: 'Zdravotnictví / Zdraví', icon: '❤️' },
];

// ─── Content generator ───────────────────────────────────────────────────────

function generateContent(data: FunnelFormData): FunnelContent {
  const templates: Record<Category, FunnelContent> = {
    eshop: {
      awareness: {
        headline: `Objevte ${data.businessName} – nakupujte chytře, žijte lépe`,
        socialPost: `🛍️ Hledáte ${data.description}? ${data.businessName} nabízí to nejlepší za skvělé ceny. Sledujte nás a jako první zjistěte o nových produktech a akcích! #nakupování #kvalita`,
        adCopy: [
          `${data.businessName}: Váš oblíbený e-shop pro ${data.targetAudience}`,
          `Tisíce spokojených zákazníků – nakupte ještě dnes!`,
          `Doprava zdarma od 999 Kč | Vrácení zboží 30 dní zdarma`,
        ],
      },
      interest: {
        emailSubject: `${data.businessName}: Speciální nabídka připravena jen pro vás`,
        emailBody: `Dobrý den,\n\nDěkujeme, že sledujete ${data.businessName}. Připravili jsme pro vás exkluzivní výběr ${data.description}.\n\nJako náš věrný zákazník získáte:\n• Slevu 10 % na první nákup\n• Prioritní dopravu zdarma\n• Přístup k limitovaným kolekcím před ostatními\n\nNabídka platí pouze 48 hodin.\n\nS pozdravem,\nTým ${data.businessName}`,
        blogTopics: [
          `Top 10 důvodů, proč si vybrat ${data.description}`,
          `Průvodce výběrem: Co hledat při nákupu ${data.description}`,
          `Recenze zákazníků: Nejoblíbenější produkty ${data.businessName}`,
        ],
      },
      conversion: {
        cta: `Nakoupit nyní se slevou 10 %`,
        landingHeadline: `${data.businessName} – ${data.description} pro ${data.targetAudience}`,
        valuePropositions: [
          `Garantovaná kvalita nebo vrácení peněz`,
          `Doprava do 24 hodin`,
          `Zákaznická podpora 7 dní v týdnu`,
          `Bezpečná platba – SSL šifrování`,
        ],
      },
    },
    restaurace: {
      awareness: {
        headline: `${data.businessName} – chuť, která se vrací`,
        socialPost: `🍽️ Hledáte perfektní místo pro ${data.description}? ${data.businessName} vás zve na nezapomenutelný gastronomický zážitek! Rezervujte stůl ještě dnes. #jídlo #gastronomie`,
        adCopy: [
          `${data.businessName}: Autentická kuchyně pro ${data.targetAudience}`,
          `Čerstvé suroviny, tradiční recepty, nezapomenutelná atmosféra`,
          `Online rezervace | Soukromé akce | Catering`,
        ],
      },
      interest: {
        emailSubject: `Zarezervujte stůl v ${data.businessName} – máme pro vás překvapení`,
        emailBody: `Dobrý den,\n\nDěkujeme za zájem o ${data.businessName}. Nabízíme vám ${data.description} v přátelské atmosféře.\n\nNovinky tohoto měsíce:\n• Nové sezónní menu\n• Víkendový brunch 10:00–14:00\n• Privátní akce a oslavy až pro 80 hostů\n\nTěšíme se na vaši návštěvu!\nTým ${data.businessName}`,
        blogTopics: [
          `Příběh za kuchyní ${data.businessName}: Kde se rodí naše recepty`,
          `5 tipů, jak si vybrat restauraci pro firemní večeři`,
          `Sezónní menu: Proč čerstvé suroviny mění vše`,
        ],
      },
      conversion: {
        cta: `Rezervovat stůl online – okamžitě`,
        landingHeadline: `${data.businessName} – ${data.description} v srdci města`,
        valuePropositions: [
          `Online rezervace za 2 minuty`,
          `Flexibilní kapacita pro skupiny 2–80 osob`,
          `Vegetariánské a bezlepkové možnosti`,
          `Parkování zdarma`,
        ],
      },
    },
    fitness: {
      awareness: {
        headline: `${data.businessName} – změňte svůj život, začněte dnes`,
        socialPost: `💪 Připraveni na změnu? ${data.businessName} nabízí ${data.description} pro ${data.targetAudience}. První trénink ZDARMA! Začněte svou cestu za lepším zdravím. #fitness #zdraví`,
        adCopy: [
          `${data.businessName}: Profesionální ${data.description} pro každého`,
          `Certifikovaní trenéři | Moderní vybavení | Flexibilní rozvrh`,
          `Zkuste to zdarma – první lekce bez závazků!`,
        ],
      },
      interest: {
        emailSubject: `Váš osobní fitness plán od ${data.businessName}`,
        emailBody: `Dobrý den,\n\nDěkujeme, že jste nás kontaktovali ohledně ${data.description}. V ${data.businessName} věříme, že každý má právo na zdravý a aktivní životní styl.\n\nPřipravíme pro vás:\n• Individuální tréninkový plán\n• Nutriční poradenství zdarma\n• Měření výsledků každý měsíc\n\nPrvní konzultace je na nás!\n\nS přáním pevného zdraví,\nTým ${data.businessName}`,
        blogTopics: [
          `Jak začít s ${data.description}: Průvodce pro začátečníky`,
          `10 cvičení, která změnila životy našich klientů`,
          `Výživa a ${data.description}: Co jíst před a po tréninku`,
        ],
      },
      conversion: {
        cta: `Začít zdarma – registrovat se nyní`,
        landingHeadline: `${data.businessName} – dosáhněte svých cílů s ${data.description}`,
        valuePropositions: [
          `První lekce zcela zdarma`,
          `Certifikovaní instruktoři`,
          `Výsledky garantovány nebo vrácení peněz`,
          `Flexibilní členství bez roční vázanosti`,
        ],
      },
    },
    vzdelavani: {
      awareness: {
        headline: `${data.businessName} – investujte do sebe, výsledky přijdou`,
        socialPost: `📚 Chcete se naučit ${data.description}? ${data.businessName} nabízí kurzy pro ${data.targetAudience}. Přes 1 000 spokojených absolventů! Zapište se ještě dnes. #vzdělávání #kurzy`,
        adCopy: [
          `${data.businessName}: Vzdělávání, které otevírá dveře`,
          `Online i prezenčně | Certifikát | Praktické dovednosti`,
          `97 % absolventů doporučuje dál – zjistěte proč`,
        ],
      },
      interest: {
        emailSubject: `Váš bezplatný průvodce k ${data.description}`,
        emailBody: `Dobrý den,\n\nPřipravili jsme pro vás bezplatného průvodce ke kurzu ${data.description} v ${data.businessName}.\n\nCo se naučíte:\n• Základní i pokročilé techniky\n• Praktické projekty z reálného světa\n• Mentoring od expertů z praxe\n\nStáhněte si průvodce zdarma a začněte ještě dnes!\n\nTým ${data.businessName}`,
        blogTopics: [
          `Proč ${data.description} je dovednost budoucnosti`,
          `Příběhy úspěchu: Absolventi ${data.businessName} mění svět`,
          `Online vs. prezenční kurz: Co je pro vás lepší?`,
        ],
      },
      conversion: {
        cta: `Zapsat se na kurz – místa ubývají`,
        landingHeadline: `${data.businessName} – zvládněte ${data.description} za 8 týdnů`,
        valuePropositions: [
          `Certifikát uznávaný zaměstnavateli`,
          `Doživotní přístup k materiálům`,
          `Mentoring od praktiků z oboru`,
          `Garance vrácení peněz do 14 dní`,
        ],
      },
    },
    reality: {
      awareness: {
        headline: `${data.businessName} – váš vysněný domov na dosah ruky`,
        socialPost: `🏠 Hledáte ${data.description}? ${data.businessName} pomáhá ${data.targetAudience} najít vysněné bydlení. Prohlédněte si naši nabídku a domluvte si bezplatnou konzultaci! #reality #bydlení`,
        adCopy: [
          `${data.businessName}: Realitní partner, kterému věříte`,
          `Stovky úspěšných transakcí | Kompletní servis | Bez starostí`,
          `Bezplatná konzultace | Férové podmínky | Transparentnost`,
        ],
      },
      interest: {
        emailSubject: `Nové nemovitosti odpovídající vašim kritériím`,
        emailBody: `Dobrý den,\n\nNa základě vašich požadavků na ${data.description} jsme pro vás vybrali nejlepší nabídky na trhu.\n\nProč ${data.businessName}:\n• Přes 200 nemovitostí v aktuální nabídce\n• Právní podpora zdarma\n• Průvodce celým procesem koupě i prodeje\n\nRádi se s vámi setkáme na bezplatné konzultaci.\n\nTým ${data.businessName}`,
        blogTopics: [
          `Průvodce koupí ${data.description}: Na co si dát pozor`,
          `Jak správně ocenit nemovitost v roce 2025`,
          `Hypoték se nemusíte bát: Kompletní průvodce`,
        ],
      },
      conversion: {
        cta: `Domluvit bezplatnou konzultaci`,
        landingHeadline: `${data.businessName} – najděte ${data.description} bez starostí`,
        valuePropositions: [
          `Bezplatná konzultace bez závazků`,
          `Právní podpora v ceně`,
          `Provize jen při úspěšném prodeji`,
          `Průvodce od prvního kontaktu po předání klíčů`,
        ],
      },
    },
    it: {
      awareness: {
        headline: `${data.businessName} – technologie, které skutečně fungují`,
        socialPost: `💻 Potřebujete ${data.description}? ${data.businessName} pomáhá ${data.targetAudience} digitalizovat a automatizovat procesy. Ušetřete čas i peníze! #technologie #digitalizace`,
        adCopy: [
          `${data.businessName}: IT řešení na míru pro váš byznys`,
          `Rychlá implementace | Podpora 24/7 | Plná škálovatelnost`,
          `Bezplatné demo | Bez dlouhodobé vázanosti`,
        ],
      },
      interest: {
        emailSubject: `Jak ${data.businessName} pomohl firmám jako je ta vaše`,
        emailBody: `Dobrý den,\n\nDěkujeme za zájem o ${data.description}. V ${data.businessName} jsme pomohli stovkám firem zefektivnit jejich procesy.\n\nNaše řešení nabízí:\n• Snadnou integraci se stávajícími systémy\n• Škálovatelnost podle vašich potřeb\n• Dedikovaný tým podpory\n\nDomluvíme si bezplatné demo?\n\nTým ${data.businessName}`,
        blogTopics: [
          `Jak ${data.description} ušetří vaší firmě 10 hodin týdně`,
          `Případová studie: Firma zvýšila obrat o 40 % díky ${data.businessName}`,
          `Digitalizace malého podniku: Kde začít?`,
        ],
      },
      conversion: {
        cta: `Vyzkoušet demo zdarma – 30 dní`,
        landingHeadline: `${data.businessName} – ${data.description} pro moderní firmy`,
        valuePropositions: [
          `30denní bezplatné vyzkoušení`,
          `Implementace do 48 hodin`,
          `SLA 99,9 % dostupnost`,
          `Integrace s 200+ nástroji`,
        ],
      },
    },
    kosmetika: {
      awareness: {
        headline: `${data.businessName} – krása, která inspiruje a vydrží`,
        socialPost: `✨ Toužíte po ${data.description}? ${data.businessName} nabízí profesionální péči pro ${data.targetAudience}. Výsledky, které mluví za vše. Objednejte se online! #kosmetika #krása`,
        adCopy: [
          `${data.businessName}: Profesionální ${data.description} s certifikovanými specialisty`,
          `Prémiové produkty | Individuální přístup | Viditelné výsledky`,
          `První ošetření se slevou 20 % – objednejte se online`,
        ],
      },
      interest: {
        emailSubject: `${data.businessName}: Speciální péče připravena jen pro vás`,
        emailBody: `Dobrý den,\n\nDěkujeme za zájem o ${data.description}. V ${data.businessName} věříme, že každý si zaslouží vypadat a cítit se skvěle.\n\nNaše speciality:\n• Individuální konzultace zdarma\n• Prémiové značky produktů\n• Věrnostní program s exkluzivními výhodami\n\nObjednejte se a uplatněte slevu 20 % na první ošetření!\n\nTým ${data.businessName}`,
        blogTopics: [
          `Průvodce ${data.description}: Mýty a fakta`,
          `5 tipů jak pečovat o pleť doma mezi ošetřeními`,
          `Jak vybrat správnou kosmetiku pro váš typ pleti`,
        ],
      },
      conversion: {
        cta: `Objednat se online – volné termíny`,
        landingHeadline: `${data.businessName} – ${data.description} pro ${data.targetAudience}`,
        valuePropositions: [
          `Konzultace zdarma před každým ošetřením`,
          `Certifikovaní specialisté s lety zkušeností`,
          `Prémiové produkty šetrné k pleti`,
          `Věrnostní program: každé 5. ošetření zdarma`,
        ],
      },
    },
    zdravotnictvi: {
      awareness: {
        headline: `${data.businessName} – vaše zdraví je naše priorita`,
        socialPost: `❤️ Staráte se o své zdraví? ${data.businessName} nabízí ${data.description} pro ${data.targetAudience}. Profesionální péče, moderní přístupy, lidský přístup. Objednejte se! #zdraví #péče`,
        adCopy: [
          `${data.businessName}: Komplexní zdravotní péče pro celou rodinu`,
          `Certifikovaní odborníci | Krátké čekací doby | Online objednávky`,
          `Prevence i léčba | Individuální přístup`,
        ],
      },
      interest: {
        emailSubject: `Váš zdravotní průvodce od ${data.businessName}`,
        emailBody: `Dobrý den,\n\nV ${data.businessName} se staráme o to, aby ${data.description} bylo dostupné pro každého.\n\nNaše služby zahrnují:\n• Preventivní prohlídky\n• Specializovaná vyšetření\n• Online konzultace z pohodlí domova\n\nObjednejte se online nebo nás kontaktujte pro více informací.\n\nTým ${data.businessName}`,
        blogTopics: [
          `Preventivní prohlídky: Proč je nepodceňovat`,
          `Jak si vybrat správného specialistu ve vašem okolí`,
          `Moderní přístupy k ${data.description}: Co je nového`,
        ],
      },
      conversion: {
        cta: `Objednat se online – ihned`,
        landingHeadline: `${data.businessName} – profesionální ${data.description}`,
        valuePropositions: [
          `Online objednávky 24/7`,
          `Krátké čekací doby`,
          `Kompletní zdravotní dokumentace online`,
          `Smluvní pojišťovny: VZP, OZP, ZPMV a další`,
        ],
      },
    },
  };

  return templates[data.category];
}

// ─── Loading messages ─────────────────────────────────────────────────────────

const LOADING_STEPS = [
  'Analyzuji váš byznys...',
  'Identifikuji cílovou skupinu...',
  'Sestavuji fázi povědomí...',
  'Generuji obsah pro zájem...',
  'Optimalizuji konverzní texty...',
  'Finalizuji váš funnel...',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-white/40 hover:text-white/70 transition-colors duration-150 flex items-center gap-1"
    >
      {copied ? (
        <><span>✓</span> Zkopírováno</>
      ) : (
        <><span>⌘</span> Kopírovat</>
      )}
    </button>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</span>
        <CopyButton text={value} />
      </div>
      <p className="text-sm text-white/80 bg-white/5 rounded-lg px-3 py-2.5 whitespace-pre-line leading-relaxed">
        {value}
      </p>
    </div>
  );
}

function ListBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</span>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/80">
            <span className="mt-0.5 text-violet-400 shrink-0">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AwarenessCard({ data }: { data: FunnelContent['awareness'] }) {
  return (
    <div className="funnel-card" style={{ animationDelay: '0ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-lg">
            👁️
          </div>
          <div>
            <h3 className="font-bold text-white">Povědomí</h3>
            <p className="text-xs text-white/40">Top of Funnel · TOFU</p>
          </div>
        </div>
        <Badge color="bg-blue-500/15 text-blue-300 border border-blue-500/20">Fáze 1</Badge>
      </div>
      <div className="h-px bg-white/5" />
      <TextBlock label="Hlavní nadpis" value={data.headline} />
      <TextBlock label="Příspěvek na sociální síti" value={data.socialPost} />
      <ListBlock label="Reklamní texty (3 varianty)" items={data.adCopy} />
    </div>
  );
}

function InterestCard({ data }: { data: FunnelContent['interest'] }) {
  return (
    <div className="funnel-card" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center text-lg">
            💡
          </div>
          <div>
            <h3 className="font-bold text-white">Zájem</h3>
            <p className="text-xs text-white/40">Middle of Funnel · MOFU</p>
          </div>
        </div>
        <Badge color="bg-violet-500/15 text-violet-300 border border-violet-500/20">Fáze 2</Badge>
      </div>
      <div className="h-px bg-white/5" />
      <TextBlock label="Předmět e-mailu" value={data.emailSubject} />
      <TextBlock label="E-mailový text" value={data.emailBody} />
      <ListBlock label="Témata pro blog / obsah" items={data.blogTopics} />
    </div>
  );
}

function ConversionCard({ data }: { data: FunnelContent['conversion'] }) {
  return (
    <div className="funnel-card" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 flex items-center justify-center text-lg">
            🎯
          </div>
          <div>
            <h3 className="font-bold text-white">Konverze</h3>
            <p className="text-xs text-white/40">Bottom of Funnel · BOFU</p>
          </div>
        </div>
        <Badge color="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">Fáze 3</Badge>
      </div>
      <div className="h-px bg-white/5" />
      <TextBlock label="Nadpis landing page" value={data.landingHeadline} />
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Hlavní CTA tlačítko</span>
        <div className="inline-flex">
          <span className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40">
            {data.cta}
          </span>
        </div>
      </div>
      <ListBlock label="Hodnoty pro zákazníka" items={data.valuePropositions} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Home() {
  const [appState, setAppState] = useState<AppState>('form');
  const [loadingStep, setLoadingStep] = useState(0);
  const [formData, setFormData] = useState<FunnelFormData>({
    businessName: '',
    category: 'eshop',
    description: '',
    targetAudience: '',
  });
  const [content, setContent] = useState<FunnelContent | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppState('loading');
    setLoadingStep(0);
  };

  useEffect(() => {
    if (appState !== 'loading') return;

    if (loadingStep < LOADING_STEPS.length - 1) {
      const timer = setTimeout(() => setLoadingStep((s) => s + 1), 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setContent(generateContent(formData));
        setAppState('results');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [appState, loadingStep, formData]);

  const handleReset = () => {
    setAppState('form');
    setContent(null);
    setLoadingStep(0);
  };

  const categoryLabel = CATEGORIES.find((c) => c.value === formData.category)?.label ?? '';

  return (
    <main className="min-h-screen bg-[#050811] relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-fuchsia-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-6">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            AI Marketing Funnel Generator
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Vytvořte marketingový{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              funnel
            </span>
            {' '}za minutu
          </h1>
          <p className="text-white/50 text-lg">
            Zadejte základní informace o vašem byznysu a získejte kompletní obsah pro všechny 3 fáze funnelu.
          </p>
        </header>

        {/* ── FORM STATE ── */}
        {appState === 'form' && (
          <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Název firmy / značky</label>
              <input
                className="input-field"
                placeholder="např. Kavárna U Modrého koně"
                value={formData.businessName}
                onChange={(e) => setFormData((f) => ({ ...f, businessName: e.target.value }))}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Kategorie byznysu</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData((f) => ({ ...f, category: cat.value }))}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 text-left ${
                      formData.category === cat.value
                        ? 'bg-violet-600/20 border-violet-500/50 text-white'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="leading-snug">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Co nabízíte? (produkt / služba)</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="např. prémiovou kávu a domácí dezerty v útulné atmosféře"
                value={formData.description}
                onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Cílová skupina</label>
              <input
                className="input-field"
                placeholder="např. mladé rodiny a studenti v Praze"
                value={formData.targetAudience}
                onChange={(e) => setFormData((f) => ({ ...f, targetAudience: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full text-center mt-2">
              Vygenerovat funnel  →
            </button>
          </form>
        )}

        {/* ── LOADING STATE ── */}
        {appState === 'loading' && (
          <div className="glass-card p-12 flex flex-col items-center gap-8 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-violet-500/20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-t-violet-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
            </div>

            <div className="text-center">
              <p className="text-white font-semibold text-lg mb-1">Generuji váš funnel</p>
              <p className="text-white/50 text-sm">
                {LOADING_STEPS[loadingStep]}
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              {LOADING_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300 ${
                    i < loadingStep
                      ? 'bg-violet-500 text-white'
                      : i === loadingStep
                      ? 'bg-violet-500/30 border border-violet-500/60 text-violet-300'
                      : 'bg-white/5 border border-white/10 text-white/20'
                  }`}>
                    {i < loadingStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${
                    i <= loadingStep ? 'text-white/70' : 'text-white/25'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS STATE ── */}
        {appState === 'results' && content && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{formData.businessName}</h2>
                <p className="text-sm text-white/40">
                  {CATEGORIES.find((c) => c.value === formData.category)?.icon}{' '}
                  {categoryLabel}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-xl transition-all duration-150"
              >
                ← Nový funnel
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="w-full h-px bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-emerald-500/40" />
              <span className="shrink-0 font-medium">3 fáze funnelu</span>
              <span className="w-full h-px bg-gradient-to-l from-blue-500/40 via-violet-500/40 to-emerald-500/40" />
            </div>

            <AwarenessCard data={content.awareness} />
            <InterestCard data={content.interest} />
            <ConversionCard data={content.conversion} />

            <div className="flex justify-center pt-2">
              <button onClick={handleReset} className="btn-primary">
                Vytvořit další funnel
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
