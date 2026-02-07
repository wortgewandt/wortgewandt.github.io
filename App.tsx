import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import Card from './components/Card';
import { APP_MOTTO, APP_YEAR, COLORS } from './constants';
import { FormData, HomileticResult, SermonStructureResult, DeepAnalysis } from './types';
import { generateHomileticAnalysis, generateSermonStructure } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'intro' | 'form' | 'loading' | 'post-load' | 'result' | 'structure-input' | 'structure-loading' | 'structure-post-load' | 'structure-result'>('intro');
  const [formData, setFormData] = useState<FormData>({
    biblePassage: '',
    audience: '',
    message: '',
    currentTopics: '',
    specialOccasion: ''
  });
  
  // Persistente Ergebnisse
  const [result, setResult] = useState<HomileticResult | null>(null);
  const [structureResult, setStructureResult] = useState<SermonStructureResult | null>(null);
  
  const [userImpulses, setUserImpulses] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeDeepAnalysis, setActiveDeepAnalysis] = useState<DeepAnalysis | null>(null);
  
  // Disclaimer Logik: Erscheint nur einmalig pro Session
  const [showAIDisclaimer, setShowAIDisclaimer] = useState(false);
  const [hasSeenAIDisclaimer, setHasSeenAIDisclaimer] = useState(false);

  // Zurücksetzen der App
  const resetApp = () => {
    setResult(null);
    setStructureResult(null);
    setUserImpulses('');
    setError(null);
    setView('form');
  };

  const startAnalysis = async () => {
    setView('loading');
    setError(null);
    try {
      const homileticResult = await generateHomileticAnalysis(formData);
      setResult(homileticResult);
      setTimeout(() => setView('post-load'), 1500); 
    } catch (err) {
      console.error(err);
      setError("Die Vorbereitung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.");
      setView('form');
    }
  };

  const startStructureGeneration = async () => {
    if (!result) return;
    setView('structure-loading');
    setError(null);
    try {
      const struct = await generateSermonStructure(formData, result, userImpulses);
      setStructureResult(struct);
      setTimeout(() => setView('structure-post-load'), 1500);
    } catch (err) {
      console.error(err);
      setError("Die Predigtstruktur konnte nicht erstellt werden.");
      setView('structure-input');
    }
  };

  const GlobalFooter = () => (
    <footer className="w-full text-center py-6 text-nak-accent-dark/50 text-[10px] border-t border-nak-accent-light/30 mt-auto uppercase tracking-[0.3em]">
      <p>Copyright {APP_YEAR} by Michael Berlik</p>
    </footer>
  );

  const renderHeader = () => (
    <header className="mb-12 flex items-center justify-between border-b-2 border-nak-border pb-6">
      <Logo size="md" />
      <div className="text-right">
        <p className="text-[10px] font-bold tracking-[0.2em] text-nak-accent-dark uppercase mb-1 opacity-30">Jahresmotto {APP_YEAR}</p>
        <p className="text-sm md:text-base font-serif text-nak-accent-dark italic opacity-50 font-medium tracking-wide">"{APP_MOTTO}"</p>
      </div>
    </header>
  );

  const renderAIDisclaimer = () => {
    if (!showAIDisclaimer) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl border-[3px] border-nak-highlight-orange text-center">
          <div className="w-16 h-16 bg-nak-highlight-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-nak-highlight-orange">⚠</span>
          </div>
          <h3 className="text-xl font-bold text-nak-accent-dark mb-4 uppercase tracking-tight">Wichtiger Hinweis</h3>
          <p className="text-nak-accent-dark leading-relaxed mb-8 text-sm md:text-base">
            Die Inhalte dieser Webapplikation werden automatisiert durch künstliche Intelligenz (Google Gemini API) auf Basis öffentlich zugänglicher Informationen zusammengestellt. Wir übernehmen keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der generierten Antworten.
          </p>
          <button 
            onClick={() => {
              setShowAIDisclaimer(false);
              setHasSeenAIDisclaimer(true);
            }}
            className="w-full bg-nak-border text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest"
          >
            Verstanden & Schließen
          </button>
        </div>
      </div>
    );
  };

  const renderIntro = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-xl w-full shadow-2xl border border-nak-border text-center">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-nak-highlight-orange italic">Don't Forget: Beten wirkt!</h2>
          <p className="text-nak-accent-dark text-base leading-relaxed">
            <span className="font-bold">Wortgewand(t)</span> ersetzt nicht das innige Gebet um Göttliche Impulse. Es soll eine Hilfestellung sein, Hintergründe zum Bibelwort zu erfahren sowie Gedankenanstöße liefern, um einen Transfer in die aktuelle Gemeinde zu schaffen.
          </p>
          <button 
            onClick={() => setView('form')}
            className="bg-nak-border text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            Anwendung starten
          </button>
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12 min-h-screen flex flex-col">
      {renderHeader()}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-nak-border shadow-xl flex-grow">
        <h3 className="text-sm font-bold mb-8 text-nak-accent-dark border-b border-nak-bg pb-3 uppercase tracking-[0.2em]">Eingabemaske & Vorbereitung</h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-nak-accent-dark uppercase">Bibelstelle(n)</label>
              <input className="w-full px-5 py-3 rounded-2xl border border-nak-accent-light bg-white text-nak-accent-dark placeholder:text-nak-accent-dark/30 focus:outline-none focus:border-nak-border transition-all" placeholder="z.B. Johannes 3, 16" value={formData.biblePassage} onChange={e => setFormData({...formData, biblePassage: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-nak-accent-dark uppercase">Zuhörerende</label>
              <input className="w-full px-5 py-3 rounded-2xl border border-nak-accent-light bg-white text-nak-accent-dark placeholder:text-nak-accent-dark/30 focus:outline-none focus:border-nak-border transition-all" placeholder="z.B. Gemeinde am Sonntag" value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-nak-accent-dark uppercase">Botschaft</label>
            <textarea className="w-full px-5 py-3 rounded-2xl border border-nak-accent-light bg-white text-nak-accent-dark placeholder:text-nak-accent-dark/30 focus:outline-none focus:border-nak-border transition-all min-h-[80px]" placeholder="Was ist die Botschaft in den Leitgedanken?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-nak-accent-dark uppercase">aktuelle Themen</label>
            <textarea className="w-full px-5 py-3 rounded-2xl border border-nak-accent-light bg-white text-nak-accent-dark placeholder:text-nak-accent-dark/30 focus:outline-none focus:border-nak-border transition-all min-h-[80px]" placeholder="Was beschäftigt Bruder und Schwester in der Gemeinde?" value={formData.currentTopics} onChange={e => setFormData({...formData, currentTopics: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-nak-accent-dark uppercase">besondere Anlässe (optional)</label>
            <input className="w-full px-5 py-3 rounded-2xl border border-nak-accent-light bg-white text-nak-accent-dark placeholder:text-nak-accent-dark/30 focus:outline-none focus:border-nak-border transition-all italic" placeholder="z.B. Taufe, Feiertage, Ehejubiläen" value={formData.specialOccasion} onChange={e => setFormData({...formData, specialOccasion: e.target.value})} />
          </div>
          <button onClick={startAnalysis} disabled={!formData.biblePassage || !formData.message} className={`w-full py-5 rounded-xl text-lg font-bold shadow-lg transition-all uppercase tracking-widest ${!formData.biblePassage || !formData.message ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-nak-highlight-green text-white hover:bg-opacity-90 active:scale-95'}`}>Vorbereitung starten</button>
          {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
        </div>
      </div>
    </div>
  );

  const renderLoading = (text: string) => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl p-12 max-w-sm w-full shadow-2xl flex flex-col items-center border border-nak-border text-center">
        <div className="mb-8 scale-75">
          <Logo size="sm" />
        </div>
        {/* Bewegter Strich zwischen Logo und Text */}
        <div className="w-48 h-[2px] shimmer-line rounded-full mb-8"></div>
        <p className="text-sm font-bold text-nak-accent-dark uppercase tracking-widest text-center animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );

  const renderPostLoad = (title: string, buttonText: string, onContinue: () => void) => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-nak-bg p-6 text-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-10 md:p-14 border border-nak-border shadow-2xl space-y-10">
        <div className="space-y-2">
          <div className="text-nak-highlight-green text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-nak-accent-dark uppercase tracking-tight">{title}</h2>
        </div>
        <button onClick={onContinue} className="w-full bg-nak-border text-white py-5 rounded-xl text-lg font-bold hover:bg-opacity-90 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
          {buttonText}
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
        {renderHeader()}
        <div className="space-y-6">
          <Card title={`Bibelwort: ${result.biblePassage}`} accentColor={COLORS.highlightOrange}>
            <p className="italic font-serif text-xl leading-relaxed text-nak-accent-dark">"{result.bibleWord}"</p>
            <footer className="mt-3 text-[10px] not-italic font-bold text-nak-accent-light tracking-widest uppercase">Luther 2017 | Quelle: die-bibel.de</footer>
          </Card>
          <Card title="Botschaft" accentColor={COLORS.highlightOrange}><p className="font-bold text-xl text-nak-highlight-orange italic leading-snug">{formData.message}</p></Card>
          <Card title="Hintergründe" accentColor={COLORS.accentLight} onMoreInfo={() => setActiveDeepAnalysis(result.backgrounds.deep)}><p className="whitespace-pre-wrap">{result.backgrounds.main}</p></Card>
          <Card title="Exegese" accentColor={COLORS.accentDark} onMoreInfo={() => setActiveDeepAnalysis(result.exegesis.deep)}><p className="whitespace-pre-wrap">{result.exegesis.main}</p></Card>
          <Card title="Kontext" accentColor={COLORS.accentLight} onMoreInfo={() => setActiveDeepAnalysis(result.context.deep)}><p className="whitespace-pre-wrap">{result.context.main}</p></Card>
          <Card title="Gattung" accentColor={COLORS.accentDark} onMoreInfo={() => setActiveDeepAnalysis(result.genre.deep)}><p className="whitespace-pre-wrap">{result.genre.main}</p></Card>
          <Card title="Urtext (Hebräisch/Griechisch)" accentColor={COLORS.accentLight} onMoreInfo={() => setActiveDeepAnalysis(result.originalText.deep)}><div className="whitespace-pre-wrap font-serif text-lg italic border-l-2 border-nak-bg pl-4">{result.originalText.main}</div></Card>
          <Card title="Theologische Aspekte" accentColor={COLORS.highlightGreen} onMoreInfo={() => setActiveDeepAnalysis(result.theologicalAspects.deep)}><p className="whitespace-pre-wrap">{result.theologicalAspects.main}</p></Card>
          <Card title="Katechismus & Glaubensartikel" accentColor={COLORS.border} onMoreInfo={() => setActiveDeepAnalysis(result.catechismRef.deep)}><p className="whitespace-pre-wrap">{result.catechismRef.main}</p></Card>
          <Card title="nac.today (Aktualität)" accentColor={COLORS.highlightOrange} onMoreInfo={() => setActiveDeepAnalysis(result.nacTodayRefs.deep)}><p className="whitespace-pre-wrap">{result.nacTodayRefs.main}</p></Card>
          <Card title="Meditation" accentColor={COLORS.accentLight} onMoreInfo={() => setActiveDeepAnalysis(result.meditation.deep)}><p className="italic font-serif text-lg leading-relaxed whitespace-pre-wrap text-nak-accent-dark/90">{result.meditation.main}</p></Card>
          <Card title="Anwendung / Übertrag" accentColor={COLORS.highlightGreen}><p className="whitespace-pre-wrap text-base font-medium">{result.communityTransfer}</p></Card>
          <Card title="Weiterführende Gedankenanstöße" accentColor={COLORS.accentDark}>
            <div className="space-y-8">
              <div className="pl-4 border-l-2 border-nak-highlight-orange"><span className="font-bold text-nak-accent-dark block mb-2 text-xs uppercase tracking-tight">Was würde fehlen...?</span><p className="text-sm italic text-nak-accent-dark/80">{result.furtherImpulses.missingWord}</p></div>
              <div className="pl-4 border-l-2 border-nak-highlight-orange"><span className="font-bold text-nak-accent-dark block mb-2 text-xs uppercase tracking-tight">Was irritiert...?</span><p className="text-sm italic text-nak-accent-dark/80">{result.furtherImpulses.irritatingParts}</p></div>
              <div className="pl-4 border-l-2 border-nak-highlight-green"><span className="font-bold text-nak-highlight-green block mb-2 text-xs uppercase tracking-tight">Die Frohe Botschaft</span><p className="text-sm italic font-semibold">{result.furtherImpulses.goodNews}</p></div>
            </div>
          </Card>
          <Card title="Übersetzungsvergleich" accentColor={COLORS.accentLight}>
             <div className="grid gap-4 text-sm">
               {(Object.entries(result.translationComparison || {})).map(([key, val]) => (
                 <div key={key} className="p-4 bg-nak-bg/10 rounded-xl border border-nak-accent-light/30">
                   <span className="font-bold block text-[10px] uppercase text-nak-accent-dark/60 mb-2 tracking-widest">{key === 'zuercher' ? 'Zürcher' : key === 'guteNachricht' ? 'Gute Nachricht' : key === 'elberfelder' ? 'Elberfelder' : 'Volxbibel'}</span> 
                   <p className="italic">"{val}"</p>
                 </div>
               ))}
             </div>
          </Card>
        </div>
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={resetApp} className="text-nak-border hover:text-nak-highlight-orange font-bold uppercase tracking-widest text-xs transition-colors border border-nak-border/20 px-8 py-4 rounded-xl">← Neue Vorbereitung starten</button>
          {structureResult ? (
            <button onClick={() => setView('structure-result')} className="bg-nak-highlight-green text-white hover:bg-opacity-90 font-bold uppercase tracking-widest text-xs transition-all px-8 py-4 rounded-xl shadow-lg">Zur Predigtstruktur →</button>
          ) : (
            <button onClick={() => setView('structure-input')} className="bg-nak-border text-white hover:bg-opacity-90 font-bold uppercase tracking-widest text-xs transition-all px-8 py-4 rounded-xl shadow-lg">Predigtstruktur erstellen →</button>
          )}
        </div>
      </div>
    );
  };

  const renderStructureInput = () => (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      {renderHeader()}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-nak-border shadow-xl">
        <h3 className="text-xl font-serif italic text-nak-accent-dark mb-6">Ich würde nun aus den bisherigen Ausarbeitungen eine mögliche Predigtstruktur erstellen. Hast du noch eigene Gedanken, die mit aufgegriffen werden soll?</h3>
        <textarea className="w-full px-6 py-4 rounded-2xl border border-nak-accent-light bg-white text-nak-accent-dark placeholder:text-nak-accent-dark/40 focus:outline-none focus:border-nak-border transition-all min-h-[200px] mb-8" placeholder="Schreibe hier deine eigenen Gedanken zum Bibelwort und der Botschaft…" value={userImpulses} onChange={e => setUserImpulses(e.target.value)} />
        <div className="flex flex-col md:flex-row gap-4">
          <button onClick={() => setView('result')} className="flex-1 text-nak-border hover:text-nak-highlight-orange font-bold uppercase tracking-widest text-xs transition-colors border border-nak-border/20 px-8 py-4 rounded-xl">Zurück zur Ausarbeitung</button>
          <button onClick={startStructureGeneration} className="flex-[2] bg-nak-highlight-green text-white py-5 rounded-xl text-lg font-bold hover:bg-opacity-90 transition-all shadow-xl uppercase tracking-widest">Predigtstruktur ausarbeiten</button>
        </div>
      </div>
    </div>
  );

  const renderStructureResult = () => {
    if (!structureResult) return null;
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
        {renderHeader()}
        <div className="space-y-8">
          <Card title="Einleitung" accentColor={COLORS.highlightOrange}>
            <div className="space-y-6">
              {(structureResult.introduction?.points || []).map((p, i) => (
                <div key={i}><span className="font-bold text-nak-accent-dark block mb-1">{p.title}</span><p className="text-sm opacity-80">{p.description}</p></div>
              ))}
            </div>
          </Card>
          <Card title="Hauptteil" accentColor={COLORS.border}>
            <div className="space-y-6">
              {(structureResult.mainPart?.points || []).map((p, i) => (
                <div key={i}><span className="font-bold text-nak-accent-dark block mb-1">{p.title}</span><p className="text-sm opacity-80">{p.description}</p></div>
              ))}
            </div>
          </Card>
          <Card title="Schluss" accentColor={COLORS.highlightGreen}>
            <div className="space-y-6">
              <p className="text-sm leading-relaxed">{structureResult.conclusion?.summary}</p>
              <div className="grid gap-4 mt-6">
                {(structureResult.conclusion?.punchyLines || []).map((line, i) => (
                  <div key={i} className="p-4 bg-nak-highlight-green/10 rounded-xl border border-nak-highlight-green/30 italic text-nak-accent-dark font-serif text-lg">"{line}"</div>
                ))}
              </div>
            </div>
          </Card>
          <Card title="Interessante Verweise" accentColor={COLORS.accentDark}>
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-bold text-nak-highlight-orange uppercase tracking-widest mb-4 border-b border-nak-bg pb-1">Bibelstellen (Luther 2017)</h4>
                <ul className="space-y-4">
                  {(structureResult.interestingReferences?.bibleReferences || []).map((ref, i) => (
                    <li key={i}><span className="font-bold text-nak-accent-dark block text-xs uppercase">{ref.reference}</span><p className="text-sm opacity-80">{ref.explanation}</p></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-nak-highlight-orange uppercase tracking-widest mb-4 border-b border-nak-bg pb-1">Katechismus der NAK</h4>
                <ul className="space-y-4">
                  {(structureResult.interestingReferences?.catechismReferences || []).map((ref, i) => (
                    <li key={i}><span className="font-bold text-nak-accent-dark block text-xs uppercase">{ref.reference}</span><p className="text-sm opacity-80">{ref.explanation}</p></li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-24 text-center space-y-8">
          <p className="text-2xl font-serif italic text-nak-accent-dark font-medium">Vom Wort zur Botschaft zur Gemeinde</p>
          <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
            <button onClick={resetApp} className="text-nak-border hover:text-nak-highlight-orange font-bold uppercase tracking-widest text-xs transition-colors border border-nak-border/20 px-8 py-4 rounded-xl">← Neue Vorbereitung starten</button>
            <button onClick={() => setView('result')} className="bg-nak-border text-white hover:bg-opacity-90 font-bold uppercase tracking-widest text-xs transition-all px-8 py-4 rounded-xl shadow-lg">Zurück zur Ausarbeitung</button>
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!activeDeepAnalysis) return null;
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-[3px] border-nak-border relative">
          <button onClick={() => setActiveDeepAnalysis(null)} className="absolute top-6 right-8 text-4xl text-nak-accent-dark hover:text-nak-highlight-orange transition-colors leading-none">&times;</button>
          <h2 className="text-2xl font-bold text-nak-accent-dark mb-8 border-b-2 border-nak-accent-light pb-4 uppercase tracking-tight">{activeDeepAnalysis.title}</h2>
          <div className="text-nak-accent-dark leading-relaxed mb-10 text-base font-medium space-y-4">{activeDeepAnalysis.content.split('\n').map((para, i) => <p key={i}>{para}</p>)}</div>
          <div className="bg-nak-bg/20 p-6 rounded-2xl border border-nak-accent-light">
            <h4 className="text-[10px] font-bold text-nak-accent-dark uppercase mb-4 tracking-[0.2em]">Verifizierte Quellen</h4>
            <ul className="text-xs text-nak-accent-dark/70 space-y-2">{activeDeepAnalysis.sources.map((s, i) => <li key={i} className="flex gap-2"><span className="text-nak-highlight-orange font-bold">•</span><span className="italic">{s}</span></li>)}</ul>
          </div>
        </div>
      </div>
    );
  };

  // Trigger Disclaimer bei Ergebnisseiten nur einmalig
  useEffect(() => {
    if (view === 'result' && result && !hasSeenAIDisclaimer) {
      setShowAIDisclaimer(true);
    }
  }, [view, result, hasSeenAIDisclaimer]);

  return (
    <div className="min-h-screen bg-nak-bg font-sans selection:bg-nak-highlight-orange selection:text-white">
      <main className="flex-grow">
        {view === 'intro' && renderIntro()}
        {view === 'form' && renderForm()}
        {view === 'loading' && renderLoading("Hintergrundinformationen werden erstellt")}
        {view === 'post-load' && renderPostLoad("Analyse abgeschlossen", "Ausarbeitung ansehen", () => setView('result'))}
        {view === 'result' && renderResult()}
        {view === 'structure-input' && renderStructureInput()}
        {view === 'structure-loading' && renderLoading("Mögliche Predigtstruktur wird erstellt")}
        {view === 'structure-post-load' && renderPostLoad("Struktur bereit", "Predigtstruktur ansehen", () => setView('structure-result'))}
        {view === 'structure-result' && renderStructureResult()}
      </main>
      
      {renderModal()}
      {renderAIDisclaimer()}
      
      <GlobalFooter />
    </div>
  );
};

export default App;