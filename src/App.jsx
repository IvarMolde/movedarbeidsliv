import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, CheckCircle2, ChevronRight, ChevronLeft, 
  Heart, Flame, Trophy, AlertTriangle, 
  Play, Home, RefreshCcw, Star, 
  Briefcase, Calendar, Users, 
  Building2, GraduationCap, Scale, MessageSquare,
  ShieldCheck, PenTool, Layers, Zap, 
  Type, History, ListChecks, Eye
} from 'lucide-react';

// --- Hjelpefunksjoner ---
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- Spesialiserte Oppgave-komponenter for å unngå Hook-feil ---

const DragWordsTask = ({ task, onAnswer, feedback }) => {
  const [dragSelections, setDragSelections] = useState({});
  const shuffledDefs = useMemo(() => shuffleArray(task.pairs.map(p => p.def)), [task]);

  const handleDragSelection = (pairIdx, def) => {
    if (feedback) return;
    setDragSelections(prev => ({ ...prev, [pairIdx]: def }));
  };

  const checkDragWords = () => {
    let allCorrect = true;
    task.pairs.forEach((p, i) => {
      if (dragSelections[i] !== p.def) allCorrect = false;
    });
    onAnswer(allCorrect && Object.keys(dragSelections).length === task.pairs.length);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {task.pairs.map((p, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="p-4 bg-indigo-950 rounded-xl border-2 border-indigo-950 font-black text-white text-center text-lg shadow-lg">
              {p.word}
            </div>
            <div className={`p-4 rounded-xl border-4 border-dashed min-h-[60px] flex items-center justify-center transition-all ${dragSelections[i] ? 'border-indigo-700 bg-white shadow-xl ring-2 ring-indigo-50' : 'border-slate-300 bg-slate-50'}`}>
              {dragSelections[i] ? (
                <button onClick={() => handleDragSelection(i, null)} className="text-slate-900 font-black text-base flex items-center justify-between w-full">
                  {dragSelections[i]} <RefreshCcw size={16} className="text-indigo-600"/>
                </button>
              ) : (
                <span className="text-slate-500 font-black italic text-sm">Velg riktig svar...</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-slate-200 rounded-[1.5rem] border-2 border-slate-300 shadow-inner text-center">
        <p className="text-[10px] font-black text-slate-700 uppercase mb-4 tracking-widest">Tilgjengelige svar:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {shuffledDefs.map((def, i) => {
            const isUsed = Object.values(dragSelections).includes(def);
            return (
              <button 
                key={i} disabled={isUsed || feedback}
                onClick={() => {
                  const nextEmpty = task.pairs.findIndex((_, idx) => !dragSelections[idx]);
                  if (nextEmpty !== -1) handleDragSelection(nextEmpty, def);
                }}
                className={`px-4 py-2 rounded-xl font-black text-base transition-all border-2 shadow-md ${isUsed ? 'bg-slate-300 border-slate-300 text-slate-600 opacity-40' : 'bg-white border-slate-400 text-slate-900 hover:border-indigo-700 hover:text-indigo-800 active:scale-95'}`}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>
      <button onClick={checkDragWords} disabled={feedback} className="w-full py-5 bg-indigo-800 text-white rounded-[1.5rem] font-black text-xl shadow-2xl transition-all active:scale-95">Sjekk koblinger</button>
    </div>
  );
};

const SortWordsTask = ({ task, onAnswer, feedback }) => {
  const [currentSort, setCurrentSort] = useState([]);

  const handleWordClick = (word) => {
    if (feedback) return;
    const newSort = [...currentSort, word];
    setCurrentSort(newSort);
    if (newSort.length === task.sentence.length) {
      onAnswer(newSort.join(' ') === task.sentence.join(' '));
    }
  };

  return (
    <div className="space-y-6">
      <div className="min-h-[80px] p-6 bg-indigo-50 rounded-[1.5rem] border-2 border-dashed border-indigo-400 flex flex-wrap gap-2 items-center justify-center shadow-inner">
        {currentSort.map((w, i) => <span key={i} className="px-4 py-2 bg-white rounded-xl shadow-md font-black text-indigo-900 text-lg animate-in zoom-in border-2 border-indigo-100">{w}</span>)}
        {currentSort.length === 0 && <span className="text-indigo-600 font-bold italic text-base">Trykk på ordene under...</span>}
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {task.shuffled.filter(w => {
          const countInSentence = task.shuffled.filter(x => x === w).length;
          const countInCurrent = currentSort.filter(x => x === w).length;
          return countInCurrent < countInSentence;
        }).map((w, i) => (
          <button key={i} disabled={feedback} onClick={() => handleWordClick(w)} className="px-6 py-3 bg-white border-2 border-slate-400 rounded-xl font-black text-lg text-slate-900 hover:border-indigo-700 hover:bg-indigo-50 transition-all active:scale-90 shadow-md">{w}</button>
        ))}
      </div>
      <button onClick={() => setCurrentSort([])} disabled={feedback} className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase tracking-widest mx-auto hover:text-indigo-800 bg-slate-200 px-4 py-1.5 rounded-full active:scale-95"><RefreshCcw size={14}/> Start på nytt</button>
    </div>
  );
};

const SortParagraphsTask = ({ task, onAnswer, feedback }) => {
  const [paraSort, setParaSort] = useState(() => shuffleArray(task.paragraphs));

  const movePara = (idx, direction) => {
    if (feedback) return;
    const newArr = [...paraSort];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    [newArr[idx], newArr[targetIdx]] = [newArr[targetIdx], newArr[idx]];
    setParaSort(newArr);
  };

  return (
    <div className="space-y-4">
      {paraSort.map((p, i) => (
        <div key={i} className={`flex items-center gap-4 p-5 rounded-[1.5rem] shadow-md border-2 transition-colors ${feedback ? 'bg-emerald-950 border-emerald-900 text-white' : 'bg-white border-slate-300'}`}>
          <div className="flex flex-col gap-2">
            <button onClick={() => movePara(i, -1)} disabled={feedback} className="p-2 bg-slate-200 hover:bg-indigo-200 rounded-lg transition-colors"><ChevronLeft className="rotate-90 text-slate-900" size={18}/></button>
            <button onClick={() => movePara(i, 1)} disabled={feedback} className="p-2 bg-slate-200 hover:bg-indigo-200 rounded-lg transition-colors"><ChevronLeft className="-rotate-90 text-slate-900" size={18}/></button>
          </div>
          <p className="text-base font-bold leading-relaxed flex-grow text-slate-900">{p}</p>
        </div>
      ))}
      <button onClick={() => onAnswer(JSON.stringify(paraSort) === JSON.stringify(task.paragraphs))} disabled={feedback} className="w-full py-5 bg-indigo-800 text-white rounded-[1.5rem] font-black text-xl mt-6 shadow-2xl active:scale-95 transition-all">Bekreft rekkefølge</button>
    </div>
  );
};

// --- Datastruktur A2 (10 Temaer) ---
const coursesA2 = [
  {
    id: 'a2-t1',
    title: 'Tema 1: Synonymer og antonymer',
    icon: <Briefcase className="text-blue-800" size={28} />,
    color: 'bg-blue-100',
    description: 'Finn ord som betyr det samme eller det motsatte.',
    text: 'I Norge er det vanlig å ha en fast jobb. En person som jobber i en bedrift, kalles en ansatt. Alle bedrifter har en leder eller en sjef. Lederen har ansvar for de andre som jobber der. Når man begynner i en ny jobb, sier vi at man skal starte i en jobb. Det er veldig viktig å skrive en arbeidskontrakt før man begynner. Kontrakten er en skriftlig avtale mellom deg og sjefen. Noen jobber 100%. Det kalles å jobbe i heltid. Andre jobber mindre, for eksempel 50%. Det kalles deltid. Etter hver måned får man penger for arbeidet man har gjort. Dette kalles lønn. Når man blir gammel, slutter man å jobbe. Da går man av med pensjon. Noen velger også å slutte i en jobb for å begynne i en ny bedrift. Som ansatt i Norge er det viktig å kjenne til sine rettigheter og plikter på arbeidsplassen. Det betyr at du må vite hva du har krav på, og hva du må gjøre.',
    tasks: [
      { type: 'choice', q: 'Finn et synonym for ordet "leder":', options: ['Sjef', 'Ansatt', 'Vikar'], correct: 0 },
      { type: 'choice', q: 'Finn et antonym for ordet "heltid":', options: ['Fast jobb', 'Deltid', 'Overtid'], correct: 1 },
      { type: 'choice', q: 'Finn et synonym for ordet "lønn":', options: ['Pensjon', 'Inntekt/Penger', 'Skatt'], correct: 1 },
      { type: 'choice', q: 'Hva er det motsatte av "å starte i en jobb"?', options: ['Å søke jobb', 'Å slutte i en jobb', 'Å jobbe overtid'], correct: 1 },
      { type: 'choice', q: 'Hva er et synonym for "ansatt"?', options: ['Arbeidsgiver', 'Arbeidstaker', 'Lærling'], correct: 1 }
    ]
  },
  {
    id: 'a2-t2',
    title: 'Tema 2: Ord og begreper',
    icon: <Scale className="text-emerald-800" size={28} />,
    color: 'bg-emerald-100',
    description: 'Hva betyr ordene vi bruker på jobben?',
    text: 'Når du får en jobb i Norge, har du både rettigheter og plikter. En arbeidsgiver er det firmaet eller den personen du jobber for. Det er arbeidsgiveren som gir deg oppgaver og betaler lønnen din. Før du begynner å jobbe, må du og sjefen skrive en arbeidskontrakt. Dette er en skriftlig avtale. Kontrakten forklarer hvilken jobb du skal gjøre, hvor mye lønn du skal få, og hvor mange timer du skal jobbe hver arbeidsuke. Noen ganger er det ekstra mye å gjøre på arbeidsplassen. Hvis du jobber mer enn det som står i kontrakten din, kalles det overtid. Da skal du ha mer betalt. Det er også regler for hva du skal gjøre hvis du blir syk. Hvis du er syk i noen få dager, kan du bruke en egenmelding. Det betyr at du gir beskjed til arbeidsgiveren om at du er syk. Da trenger du ikke å gå til legen med en gang. Mange ansatte i Norge velger å være medlem i en fagforening. En fagforening er en organisasjon som hjelper arbeidere. De jobber for at du skal få riktig lønn og et trygt arbeidsmiljø. De kan også hjelpe deg hvis det oppstår problemer på jobben.',
    tasks: [
      { type: 'choice', q: 'Hva er en "arbeidsgiver"?', options: ['En ansatt', 'Firmaet eller personen du jobber for', 'En kollega'], correct: 1 },
      { type: 'tf', q: 'En arbeidskontrakt kan være muntlig.', answer: false },
      { type: 'drag-words', q: 'Koble ord til riktig forklaring:', pairs: [
          { word: 'Overtid', def: 'Jobbe mer enn avtalt' },
          { word: 'Egenmelding', def: 'Melding om sykdom' },
          { word: 'Fagforening', def: 'Hjelper arbeidere' }
      ]},
      { type: 'choice', q: 'Hva betyr "overtid"?', options: ['Å komme for sent', 'Å jobbe mindre enn avtalt', 'Å jobbe mer enn det som står i kontrakten'], correct: 2 },
      { type: 'blank', text: 'En organisasjon som hjelper arbeidere kalles en [blank].', answer: 'fagforening' }
    ]
  },
  {
    id: 'a2-t3',
    title: 'Tema 3: Finn fakta',
    icon: <Calendar className="text-orange-800" size={28} />,
    color: 'bg-orange-100',
    description: 'Finn informasjon om regler i teksten.',
    text: 'I Norge er det klare regler for hvor mye man skal jobbe og hvilke rettigheter man har. En vanlig arbeidsuke for en som jobber heltid, er 37,5 timer. Hvis man jobber mer enn dette, kalles det overtid. Alle ansatte har rett på ferie for å hvile. Etter ferieloven har man rett på 25 virkedager ferie hvert år (dette tilsvarer fire uker og én dag). Mange har også avtaler som gir fem uker ferie. Hvis du blir syk, kan du bruke egenmelding. Det er vanlig at man kan bruke egenmelding 4 ganger i året, og hver gang kan man være borte i inntil 3 dager. Hvis man er syk lenger, må man ha sykemelding fra lege. Når man får barn, har foreldrene rett til fri fra jobb. Dette kalles foreldrepermisjon. Det er NAV som betaler foreldrepenger når man er i permisjon, slik at man har inntekt mens man er hjemme med barnet. Hvis du ønsker å slutte i jobben, eller hvis arbeidsgiveren må si deg opp, er det en oppsigelsestid. Dette er tiden du må jobbe etter at du har sagt opp. Den korteste oppsigelsestiden i Norge er vanligvis 14 dager (dette gjelder ofte i prøvetiden), men det vanligste er én til tre måneder.',
    tasks: [
      { type: 'choice', q: 'Hvor mange feriedager har man rett på i året?', options: ['21 dager', '25 dager', '30 dager'], correct: 1 },
      { type: 'choice', q: 'Hvor mange timer er en vanlig arbeidsuke (heltid)?', options: ['35 timer', '37,5 timer', '40 timer'], correct: 1 },
      { type: 'tf', q: 'NAV betaler foreldrepenger under permisjon.', answer: true },
      { type: 'blank', text: 'En vanlig arbeidsuke er [blank] timer.', answer: '37,5' },
      { type: 'choice', q: 'Hva er den korteste oppsigelsestiden?', options: ['7 dager', '14 dager', '1 måned'], correct: 1 }
    ]
  },
  {
    id: 'a2-t4',
    title: 'Tema 4: Sette inn ord',
    icon: <PenTool className="text-purple-800" size={28} />,
    color: 'bg-purple-100',
    description: 'Vikar, permisjon og oppsigelsestid.',
    text: 'I arbeidslivet bruker vi mange spesielle ord. En vikar er en person som jobber i stedet for en som er syk eller har fri. Hvis man trenger fri fra jobb for en periode, for eksempel ved fødsel eller videreutdanning, kaller vi det permisjon. Noen ganger kan man også få permisjon for korte hendelser som begravelser. Når man skal slutte i en jobb, må man jobbe ut oppsigelsestiden sin. Dette er tiden fra man sier opp til man faktisk slutter. Alle viktige avtaler på en arbeidsplass, som arbeidskontrakten, skal alltid være skriftlige. Det finnes mange yrker, for eksempel renholder, som er en person som vasker lokaler.',
    tasks: [
      { type: 'blank', text: 'En arbeidskontrakt skal alltid være [blank].', answer: 'skriftlig' },
      { type: 'blank', text: 'Jeg må søke om [blank] hvis jeg skal i en begravelse.', answer: 'permisjon' },
      { type: 'blank', text: 'En [[blank] jobber i stedet for en som er syk.', answer: 'vikar' },
      { type: 'blank', text: 'Man må jobbe i en [[blank] før man kan slutte helt.', answer: 'oppsigelsestid' },
      { type: 'blank', text: 'En renholder er en person som [blank] lokaler.', answer: 'vasker' }
    ]
  },
  {
    id: 'a2-t5',
    title: 'Tema 5: Substantiv',
    icon: <Type className="text-pink-800" size={28} />,
    color: 'bg-pink-100',
    description: 'Bøyning av ord: Kontrakt, time, måned.',
    text: 'For å kommunisere godt på en arbeidsplass må vi bruke riktig bøyning av substantiv. Her er noen faste mønstre for vanlige ord: En kontrakt - kontrakten - kontrakter - kontraktene. En time - timen - timer - timene. En måned - måneden - måneder - månedene. En arbeidsuke - arbeidsuken - arbeidsuker - arbeidsukene. En sjef - sjefen - sjefer - sjefene. Pass på at du bruker bestemt form når du snakker om en spesifikk ting eller avtale.',
    tasks: [
      { type: 'blank', text: 'En kontrakt - [blank] (bestemt entall).', answer: 'kontrakten' },
      { type: 'blank', text: 'En time - Timen - Alle [blank] (bestemt flertall).', answer: 'timene' },
      { type: 'blank', text: 'En måned - Flere [blank] (ubestemt flertall).', answer: 'måneder' },
      { type: 'blank', text: 'En arbeidsuke - [blank] (bestemt entall).', answer: 'arbeidsuken' },
      { type: 'blank', text: 'En sjef - Sjefen - Flere [blank].', answer: 'sjefer' }
    ]
  },
  {
    id: 'a2-t6',
    title: 'Tema 6: Lag setninger',
    icon: <Zap className="text-yellow-800" size={28} />,
    color: 'bg-yellow-100',
    description: 'Setningsoppbygging og ordstilling.',
    text: 'I en norsk setning kommer verbet (gjøre-ordet) vanligvis på plass nummer to. Vi kaller dette V2-regelen. For eksempel: "Jeg jobber i dag" eller "I dag jobber jeg". Det er viktig å plassere ordene riktig slik at setningen gir mening. Bruk ord som "syk", "ferie", "sjef", "tjene" og "hjelpe" for å øve på setningsoppbygging.',
    tasks: [
      { type: 'sort-words', q: 'Sett ordene i riktig rekkefølge:', sentence: ['Jeg', 'er', 'syk', 'i', 'dag.'], shuffled: ['dag.', 'syk', 'Jeg', 'i', 'er'] },
      { type: 'sort-words', q: 'Sett ordene i riktig rekkefølge:', sentence: ['Sjefen', 'skriver', 'en', 'kontrakt.'], shuffled: ['en', 'kontrakt.', 'skriver', 'Sjefen'] },
      { type: 'choice', q: 'Hvilken setning er riktig?', options: ['I dag jeg jobber.', 'I dag jobber jeg.', 'Jobber jeg i dag.'], correct: 1 },
      { type: 'sort-words', q: 'Bygg setningen:', sentence: ['Vi', 'skal', 'ha', 'ferie', 'snart.'], shuffled: ['snart.', 'ferie', 'ha', 'skal', 'Vi'] },
      { type: 'choice', q: 'Hva er riktig?', options: ['Sjefen er snill.', 'Sjefen er snilt.', 'Sjefen snill er.'], correct: 0 }
    ]
  },
  {
    id: 'a2-t7',
    title: 'Tema 7: Forklar ordene',
    icon: <History className="text-teal-800" size={28} />,
    color: 'bg-teal-100',
    description: 'Deltid, lønn, vikariat og pause.',
    text: 'Her skal vi gå gjennom betydningen av viktige ord i hverdagen på jobb. Deltid betyr å jobbe mindre enn full stilling (100%). Lønn er pengene du tjener for arbeidet du utfører. En oppsigelse er når enten du eller sjefen gir beskjed om at du skal slutte. Et vikariat er en jobb som bare varer en bestemt periode. En pause er en viktig del av arbeidsdagen for å spise, drikke og hvile.',
    tasks: [
      { type: 'choice', q: 'Hva er et vikariat?', options: ['Fast jobb', 'Midlertidig jobb', 'Ferie'], correct: 1 },
      { type: 'choice', q: 'Hva er "pause"?', options: ['Å slutte i jobben', 'Tid til å hvile og spise', 'Å jobbe overtid'], correct: 1 },
      { type: 'choice', q: 'Hva betyr deltid?', options: ['Jobbe 100%', 'Jobbe mindre enn 100%', 'Å være vikar'], correct: 1 },
      { type: 'tf', q: 'Lønn er penger du får fra banken som en gave.', answer: false },
      { type: 'blank', text: 'At arbeidsforholdet avsluttes kalles en opp[blank].', answer: 'sigelse' }
    ]
  },
  {
    id: 'a2-t8',
    title: 'Tema 8: Rett eller galt',
    icon: <CheckCircle2 className="text-indigo-800" size={28} />,
    color: 'bg-indigo-100',
    description: 'Er påstandene sanne eller usanne?',
    text: 'Som ansatt i Norge er det viktig å kjenne til sine rettigheter og plikter på arbeidsplassen. Det betyr at du må vite hva du har krav på, og hva du må gjøre. Alle som jobber har rett til ferie, men man må følge reglene i ferieloven. En kontrakt må alltid være skriftlig for å sikre begge parter. NAV er en viktig støttespiller når man er i permisjon eller trenger økonomisk bistand.',
    tasks: [
      { type: 'tf', q: 'Alle har rett til ferie i Norge.', answer: true },
      { type: 'tf', q: 'En kontrakt kan være muntlig.', answer: false },
      { type: 'tf', q: 'Sjefen er det samme som arbeidstaker.', answer: false },
      { type: 'tf', q: 'NAV betaler foreldrepenger.', answer: true },
      { type: 'tf', q: 'Man kan bruke egenmelding 30 ganger i året.', answer: false }
    ]
  },
  {
    id: 'a2-t9',
    title: 'Tema 9: Omskriving',
    icon: <RefreshCcw className="text-red-800" size={28} />,
    color: 'bg-red-100',
    description: 'Si det samme på en annen måte.',
    text: 'Noen uttrykk i arbeidslivet kan være vanskelige å forstå. "Jeg er ansatt her" betyr rett og slett "Jeg jobber her". "Han er sykemeldt" betyr at han har fått en beskjed fra legen om å ikke jobbe. "Vi har fleksitid" betyr at man kan velge litt selv når man starter og slutter på jobb. "Arbeidet legges ned" betyr at bedriften slutter med den oppgaven eller avdelingen. "De forhandler" betyr at partene diskuterer for å bli enige om en avtale.',
    tasks: [
      { type: 'choice', q: '"Jeg er ansatt her" betyr:', options: ['Jeg eier firmaet', 'Jeg jobber her', 'Jeg leter etter jobb'], correct: 1 },
      { type: 'choice', q: '"Vi have fleksitid" betyr:', options: ['Vi jobber natt', 'Vi kan velge arbeidstid litt selv', 'Vi have fri'], correct: 1 },
      { type: 'choice', q: '"De forhandler" betyr:', options: ['De krangler', 'De diskuterer for å bli enige', 'De selger varer'], correct: 1 },
      { type: 'tf', q: '"Arbeidet legges ned" betyr at bedriften fortsetter som før.', answer: false },
      { type: 'blank', text: '"Han er sykemeldt" betyr at han ikke kan [blank].', answer: 'jobbe' }
    ]
  },
  {
    id: 'a2-t10',
    title: 'Tema 10: Refleksjon',
    icon: <MessageSquare className="text-slate-800" size={28} />,
    color: 'bg-slate-200',
    description: 'Vurder situasjoner i arbeidslivet.',
    text: 'Det er viktig å ha en skriftlig kontrakt for å unngå konflikter og sikre sine rettigheter. En god kollega er hjelpsom, punktlig og bidrar positivt til arbeidsmiljøet. Det å velge mellom heltid eller deltid avhenger ofte av personlig økonomi og familieliv. Tenk over hva som er viktigst for deg i din jobbhverdag: Er det 25 dager ferie, fleksitid eller å ha en snill sjef?',
    tasks: [
      { type: 'choice', q: 'Hvorfor er det viktig med kontrakt?', options: ['Få gratis mat', 'Sikre rettigheter og lønn', 'Vise til venner'], correct: 1 },
      { type: 'choice', q: 'Hva kjennetegner en god kollega?', options: ['Jobber alene', 'Hjelpsom og punktlig', 'Tar aldri pause'], correct: 1 },
      { type: 'choice', q: 'Når bør man bruke egenmelding?', options: ['Når man er syk i få dager', 'Når man vil ha ferie', 'Når man er trøtt'], correct: 0 },
      { type: 'choice', q: 'Hva er fordelen med heltid?', options: ['Mer fritid', 'Stabil økonomi', 'Mindre ansvar'], correct: 1 },
      { type: 'choice', q: 'Hva betyr punktlighet?', options: ['Å komme for sent', 'Å komme til rett tid', 'Å jobbe fort'], correct: 1 }
    ]
  }
];

// --- Datastruktur B1 ---
const coursesB1 = [
  {
    id: 'b1-t1',
    title: 'Tema 1: Inkluderende arbeidsliv',
    icon: <Users className="text-blue-900" size={28} />,
    color: 'bg-blue-200',
    description: 'Diskriminering og fast ansettelse.',
    text: 'I et inkluderende arbeidsliv er det avgjørende å motvirke forskjellsbehandling. Alle skal ha like muligheter uavhengig av bakgrunn, og det er arbeidsgivers plikt å skape et miljø fritt for diskriminering. For å sikre stabilitet for de ansatte, foretrekker de fleste fast ansettelse. Ledere har et stort ansvar for å ivareta de ansattes behov.',
    tasks: [
      { type: 'choice', q: 'Finn et synonym for "diskriminering":', options: ['Inkludering', 'Forskjellsbehandling', 'Samarbeid'], correct: 1 },
      { type: 'choice', q: 'Finn et synonym for "å bistå":', options: ['Å hindre', 'Å hjelpe', 'Å kontrollere'], correct: 1 },
      { type: 'tf', q: 'Diskriminering er lov hvis man er uenig med sjefen.', answer: false },
      { type: 'blank', text: 'Det motsatte av fast ansettelse er [blank] ansettelse.', answer: 'midlertidig' },
      { type: 'choice', q: 'Hva betyr det "å ivareta" de ansatte?', options: ['Å ignorere dem', 'Å passe på dem', 'Å si dem opp'], correct: 1 }
    ]
  },
  {
    id: 'b1-t2',
    title: 'Tema 2: Tariff og konflikter',
    icon: <Building2 className="text-orange-900" size={28} />,
    color: 'bg-orange-200',
    description: 'Tariffavtale, streik og lockout.',
    text: 'I Norge er arbeidslivet preget av et tett samarbeid mellom de ansattes organisasjoner (fagforeninger) og arbeidsgiverne. En viktig del av dette er en kollektiv avtale, også kalt en tariffavtale. Dette er en overordnet avtale mellom en fagforening og en arbeidsgiverforening som fastsetter felles regler for lønn, arbeidstid og ferie for alle ansatte i en bransje. For å fornye disse avtalene gjennomføres det jevnlig tarifforhandlinger. Dette innebærer at partene møtes for å diskutere og forhandle om blant annet lønnsforhøyelse og bedre arbeidsvilkår. Hvis partene ikke blir enige, kan det oppstå en arbeidskonflikt. En streik er når de ansatte slutter å jobbe for å legge press på arbeidsgiveren. En lockout er det motsatte; da er det arbeidsgiveren som stenger de ansatte ute fra arbeidsplassen for å tvinge frem en løsning. Et annet viktig begrep er ansiennitet. Dette viser til hvor lenge du har vært ansatt i en bedrift. Ved en eventuell nedbemanning eller oppsigelse på grunn av økonomiske problemer, brukes ofte prinsippet "sist inn, først ut". Det betyr at ansiennitet gir et visst vern; de som har jobbet der kortest, må gå først. Mange yrker krever arbeid utenom den vanlige kontortiden fra 08.00 til 16.00. Dette kalles ubekvem arbeidstid. Det inkluderer kveldsarbeid, nattarbeid og jobb i helger eller på helligdager. For slik arbeidstid har man som regel krav på ekstra økonomiske tillegg i lønnen.',
    tasks: [
      { type: 'drag-words', q: 'Koble ordene:', pairs: [
        { word: 'Streik', def: 'Ansatte slutter å jobbe' },
        { word: 'Lockout', def: 'Sjefen stenger dørene' },
        { word: 'Ansiennitet', def: 'Tid i bedriften' }
      ]},
      { type: 'choice', q: 'Hva er en tariffavtale?', options: ['Privat kontrakt', 'Kollektiv avtale for en bransje', 'En oppsigelse'], correct: 1 },
      { type: 'tf', q: 'Streik er lovlig bare under tarifforhandlinger.', answer: true },
      { type: 'sort-words', q: 'Bygg setningen:', sentence: ['Tariffavtalen', 'gir', 'felles', 'regler', 'for', 'lønn.'], shuffled: ['regler', 'lønn.', 'for', 'gir', 'Tariffavtalen', 'felles'] },
      { type: 'choice', q: 'Hva betyr "ubekvem arbeidstid"?', options: ['Jobb i kontortid', 'Kveld, natt og helg', 'Når man er syk'], correct: 1 }
    ]
  },
  {
    id: 'b1-t3',
    title: 'Tema 3: Leseforståelse',
    icon: <BookOpen className="text-emerald-900" size={28} />,
    color: 'bg-emerald-200',
    description: 'Prøveperiode og permittering.',
    text: 'Det norske arbeidslivet er basert på tillit og klare juridiske rammer. Et sentralt element er at partene i arbeidslivet har et tett samarbeid. Dette betyr at myndighetene, arbeidsgiverne og arbeidstakerne snakker sammen for å finne løsninger som gagner både økonomien og de ansattes velferd. Når man starter i en ny jobb, er det vanlig med en prøveperiode, ofte på seks måneder. Formålet med dette er at både bedriften og den ansatte skal få tid til å vurdere om vedkommende passer til oppgavene og arbeidsmiljøet. I denne perioden er det ofte en gjensidig kortere oppsigelsestid. Dersom en bedrift opplever en midlertidig krise, for eksempel på grunn av ordremangel, kan de ansatte bli permittert. Det betyr at arbeidsforholdet består, men at man midlertidig fritas for arbeidsplikt og lønn. Den ansatte må da søke om dagpenger fra NAV. Dette er forskjøllig fra en oppsigelse, som er permanent. For at en oppsigelse skal være juridisk gyldig, må den være saklig begrunnet, enten i arbeidstakerens forhold (som alvorlige regelbrudd) eller i bedriftens forhold (som nedbemanning). Den må også alltid leveres skriftlig. For mange er fleksitid en viktig gode. Det innebærer at man kan velge når på dagen man starter og slutter, så lenge man jobber det antall timer man skal. Dette påvirker balansen mellom jobb og fritid positivt, da det gjør det lettere å kombinere karriere med familieliv og private avtaler.',
    tasks: [
      { type: 'choice', q: 'Hva skjer ved permittering?', options: ['Oppsigelse', 'Midlertidig pause i jobben', 'Lønnsforhøyelse'], correct: 1 },
      { type: 'choice', q: 'Hvor lang er prøvetiden vanligvis?', options: ['1 måned', '3 måneder', '6 måneder'], correct: 2 },
      { type: 'tf', q: 'Man får lønn fra arbeidsgiver under permittering.', answer: false },
      { type: 'blank', text: 'Under permittering kan man søke [blank] fra NAV.', answer: 'dagpenger' },
      { type: 'choice', q: 'Hvordan påvirker fleksitid balansen mellom jobb og fritid?', options: ['Negativt', 'Positivt', 'Ingen effekt'], correct: 1 }
    ]
  },
  {
    id: 'b1-t4',
    title: 'Tema 4: Sette inn ord',
    icon: <Layers className="text-indigo-900" size={28} />,
    color: 'bg-indigo-200',
    description: 'Tillitsvalgt og sanksjoner.',
    text: 'I et profesjonelt arbeidsmiljø må regler følges strengt. En oppsigelse må alltid drøftes med den ansatte først for å sikre en rettferdig prosess. Hvis man blir diskriminert eller urettmessig behandlet, kan man få medhold på sin klage etter en grundig gjennomgang. En tillitsvalgt representerer medlemmene i en fagforening og fungerer som et bindeledd mellom ansatte og ledelsen. Det er ikke rettmessig å si opp noen uten en saklig grunn som er godt dokumentert. Lovbrudd på arbeidsplassen, som manglende HMS eller trakassering, kan føre til strenge sanksjoner fra myndighetene.',
    tasks: [
      { type: 'blank', text: 'En oppsigelse må alltid [blank] med den ansatte.', answer: 'drøftes' },
      { type: 'blank', text: 'Hvis man blir diskriminert, kan man få [[blank] på klagen.', answer: 'medhold' },
      { type: 'blank', text: 'En [[blank] representerer fagforeningens medlemmer.', answer: 'tillitsvalgt' },
      { type: 'blank', text: 'Det er ikke [blank] å si opp uten saklig grunn.', answer: 'rettmessig' },
      { type: 'blank', text: 'Brudd på regler kan føre til [blank].', answer: 'sanksjoner' }
    ]
  },
  {
    id: 'b1-t5',
    title: 'Tema 5: Grammatikk (Passiv)',
    icon: <Zap className="text-red-900" size={28} />,
    color: 'bg-red-200',
    description: 'Passiv form og subjunksjoner.',
    text: 'Hva betyr passiv form? I en vanlig setning (aktiv) er det subjektet som gjør noe: "Mamma vasker bilen." I passiv form flytter vi fokus fra hvem som gjør noe, til hva som skjer. Subjektet i setningen blir det som blir gjort noe med: "Bilen vaskes" eller "Bilen blir vasket". Vi bruker ofte passiv i formelle tekster eller når det ikke er viktig hvem som utfører handlingen. På norsk lager vi passiv på to måter: 1. s-passiv: Legge til -s på slutten av verbet (skrives). 2. bli-passiv: Bruke hjelpeverbet bli + perfektum partisipp (blir skrevet). I tillegg bruker vi subjunksjoner for å binde setninger sammen. Ord som "selv om", "ettersom" og "dersom" er viktige verktøy for å nyansere språket og forklare forholdet mellom ulike hendelser på arbeidsplassen.',
    tasks: [
      { type: 'blank', text: 'Aktiv: Sjefen skriver kontrakten. Passiv: Kontrakten [blank].', answer: 'skrives' },
      { type: 'choice', q: 'Fullfør: Jeg går på jobb...', options: ['selv om jeg er syk', 'fordi jeg er syk', 'dersom jeg er frisk'], correct: 0 },
      { type: 'blank', text: 'Aktiv: Fagforeningen hjelper oss. Passiv: Vi [blank].', answer: 'hjelpes' },
      { type: 'choice', q: 'Fullfør: Han ble permittert...', options: ['selv om han jobbet mye', 'ettersom det var lite arbeid', 'fordi han var sjef'], correct: 1 },
      { type: 'choice', q: 'Hvilken er riktig?', options: ['Dersom du sies opp, må det være skriftlig.', 'Oppsigelse dersom du sies opp.', 'Skriftlig dersom oppsigelse.'], correct: 0 }
    ]
  },
  {
    id: 'b1-t6',
    title: 'Tema 6: Komplekse setninger',
    icon: <PenTool className="text-slate-900" size={28} />,
    color: 'bg-slate-300',
    description: 'Yrkesskade og omplassering.',
    text: 'For å forklare komplekse situasjoner i arbeidslivet trenger vi bindeord og et presist ordvalg. En yrkesskade er en skade som oppstår på arbeidsplassen i arbeidstiden, og det er viktig at dette dokumenteres korrekt for forsikring og oppfølging. Lønnen i Norge stiger ofte med økt ansiennitet, noe som betyr at de som har vært ansatt lengst, tjener mer. Dersom en ansatt opplever utfordringer med helsen, kan omplassering til andre oppgaver i samme bedrift være en god løsning. Årsakssammenhenger forklares ofte med "fordi" eller "derfor", som for eksempel når en arbeidstaker klager fordi vedkommende har opplevd diskriminering.',
    tasks: [
      { type: 'choice', q: 'Hva er årsaken til streik?', options: ['Uenighet i tarifforhandlinger', 'Sykdom', 'Ferie'], correct: 0 },
      { type: 'choice', q: 'Hva betyr "yrkesskade"?', options: ['Skade hjemme', 'Skade på arbeidsplassen', 'Skade på bilen'], correct: 1 },
      { type: 'choice', q: 'Hvilken setning inneholder både lønn og ansiennitet?', options: ['Lønnen stiger med ansiennitet.', 'Lønn er ansiennitet.', 'Han fikk lønn.'], correct: 0 },
      { type: 'choice', q: 'Hva er omplassering?', options: ['Å få sparken', 'Nye oppgaver i samme firma', 'Å bytte jobb'], correct: 1 },
      { type: 'choice', q: 'Bruk "fordi" om diskriminering:', options: ['Han klaget fordi han ble diskriminert.', 'Diskriminering skjer fordi vi er like.', 'Fordi diskriminering han klaget.'], correct: 0 }
    ]
  },
  {
    id: 'b1-t7',
    title: 'Tema 7: Arbeidsmiljølov',
    icon: <ShieldCheck className="text-yellow-900" size={28} />,
    color: 'bg-yellow-200',
    description: 'Taushetserklæring og avspasering.',
    text: 'For å sikre at alle har det bra på jobb, har vi i Norge en egen arbeidsmiljølov. Dette er en omfattende lov som skal sikre et trygt fysisk og psykisk arbeidsmiljø for alle ansatte. Loven setter grenser for arbeidstid og gir regler for både sikkerhet og rettigheter. En del av det å jobbe i visse yrker, er å håndtere sensitive opplysninger. Da må man ofte signere en taushetserklæring. Dette er et juridisk dokument som bekrefter at man forstår taushetsplikten og lover å ikke dele fortrolig informasjon med uvedkommende. Måten vi får betalt på kan også variere. Mens de fleste har en fast månedslønn, finnes det også systemer med prestasjonslønn. Det betyr at lønnen din avhenger av resultatene du oppnår, for eksempel gjennom salg eller effektivitet. Dersom en ansatt ikke lenger kan utføre sine vanlige oppgaver, for eksempel på grunn av helseproblemer eller endringer i bedriften, kan omplassering være en løsning. Mange som jobber fleksibelt samler opp ekstra timer som kan tas ut som fri senere. Dette kalles avspasering.',
    tasks: [
      { type: 'choice', q: 'Hva er avspasering?', options: ['Fri uten lønn', 'Ta ut ekstra timer som fri', 'Sykemelding'], correct: 1 },
      { type: 'choice', q: 'Hva er formålet med arbeidsmiljøloven?', options: ['Beskytte sjefen', 'Sikre et trygt arbeidsmiljø', 'Øke skatten'], correct: 1 },
      { type: 'choice', q: 'Hva betyr prestasjonslønn?', options: ['Fast lønn', 'Lønn basert på resultater', 'Gave'], correct: 1 },
      { type: 'tf', q: 'Taushetsplikt gjelder bare i staten.', answer: false },
      { type: 'blank', text: 'Å flyttes til en annen avdeling kalles om[blank].', answer: 'plassering' }
    ]
  },
  {
    id: 'b1-t8',
    title: 'Tema 8: Rett eller galt (Jus)',
    icon: <ListChecks className="text-purple-900" size={28} />,
    color: 'bg-purple-200',
    description: 'Avanserte juridiske påstander.',
    text: 'Det norske arbeidslivet er basert på tillit, men det er også bygget på et sterkt juridisk fundament. Diskriminering på grunn av religion, kjønn, etnisitet eller seksuell orientering er strengt forbudt ved lov. Ansiennitet gir et visst vern ved nedbemanning, men det er ikke den eneste faktoren som teller. Sykepenger betales ikke alltid av NAV fra dag 1; det finnes en arbeidsgiver periode først. For at en oppsigelse skal være gyldig, må den være saklig begrunnet og leveres skriftlig. Permittering gir rett til dagpenger fra NAV, men det betyr ikke at man får full lønn uten å jobbe i et helt år.',
    tasks: [
      { type: 'tf', q: 'Sykepenger betales av NAV fra dag 1.', answer: false },
      { type: 'tf', q: 'Diskriminering pga religion er forbudt.', answer: true },
      { type: 'tf', q: 'En sjef kan si opp hvem som helst uten grunn.', answer: false },
      { type: 'tf', q: 'Permittering gir rett til dagpenger.', answer: true },
      { type: 'tf', q: 'Ansiennitet er det eneste som teller ved oppsigelse.', answer: false }
    ]
  },
  {
    id: 'b1-t9',
    title: 'Tema 9: Omskriving (Formell)',
    icon: <MessageSquare className="text-cyan-900" size={28} />,
    color: 'bg-cyan-200',
    description: 'Formelt vs uformelt språk på jobb.',
    text: 'I profesjonell sammenheng i Norge er det viktig å kunne veksle mellom formelt og uformelt språk. Mens vi snakker uformelt med kolleger i lunsjen ("Jeg fikk fyken"), bruker vi formelt språk i dokumenter og offisiell korrespondanse ("Arbeidsforholdet ble avsluttet"). Et uformelt krav som "Jeg vil ha mer penger" bør skrives om til "Jeg krever lønnsforhøyelse" i en forhandling. Når man iverksetter permitteringer, betyr det i praksis at bedriften sender folk hjem midlertidig. Brudd på arbeidsmiljøloven er en alvorlig situasjon som i formell tale beskrives som at "det foreligger brudd på lovverket".',
    tasks: [
      { type: 'choice', q: 'Skriv formelt: "Sjefen ga meg sparken"', options: ['Jeg måtte gå', 'Arbeidsforholdet ble avsluttet', 'Jeg fikk fyken'], correct: 1 },
      { type: 'choice', q: 'Skriv formelt: "Jeg vil ha mer penger"', options: ['Gi meg mer cash', 'Jeg krever lønnsforhøyelse', 'Jeg må få mer'], correct: 1 },
      { type: 'choice', q: 'Skriv uformelt: "Virksomheten iverksetter permitteringer"', options: ['Bedriften sender folk hjem', 'Vi skal ha møte', 'Det er krise'], correct: 0 },
      { type: 'choice', q: 'Skriv formelt: "Jeg er syk i dag"', options: ['Jeg er dårlig', 'Jeg må melde fravær pga sykdom', 'Jeg blir hjemme'], correct: 1 },
      { type: 'tf', q: '"Det foreligger brudd på loven" er uformelt språk.', answer: false }
    ]
  },
  {
    id: 'b1-t10',
    title: 'Tema 10: Refleksjon og analyse',
    icon: <GraduationCap className="text-pink-900" size={28} />,
    color: 'bg-pink-200',
    description: 'Den nordiske modellen.',
    text: 'Det norske arbeidslivet er kjent for den såkalte "nordiske modellen". Et av de viktigste kjennetegnene er et organisert arbeidsliv, der de fleste arbeidstakere og arbeidsgivere er medlemmer i foreninger som forhandler om felles regler. Dette systemet gir stor trygghet og stabilitet, men det krever også at partene er villige til å inngå kompromisser. For å sikre rettferdighet er det strenge formkrav ved oppsigelse; den må skje skriftlig og med saklig begrunnelse for å sikre rettssikkerheten. Inkludering er et viktig mål, da diskriminering fører til at samfunnet mister verdifull kompetanse. Moderne arbeidsformer som fleksitid gir ansatte frihet til å balansere jobb og fritid, noe som ofte øker motivasjonen. For å lykkes i dette systemet er det ikke bare teknisk kompetanse som teller; myke ferdigheter som samarbeidsevne, punktlighet og selvstendighet er avgjørende kvaliteter i norsk arbeidskultur.',
    tasks: [
      { type: 'sort-paragraphs', q: 'Sett avsnittene i rekkefølge:', paragraphs: [
        'Den nordiske modellen er et samarbeid mellom stat og partene.',
        'Dette samarbeidet skaper stor tillit i samfunnet.',
        'Tilliten gjør at vi har et stabilt og trygt arbeidsliv.',
        'Likevel krever det vilje til å inngå kompromisser.'
      ]},
      { type: 'choice', q: 'Hva er en "myk ferdighet"?', options: ['Truckførerbevis', 'Samarbeidsevne', 'Koding'], correct: 1 },
      { type: 'choice', q: 'Hvorfor er skriftlig oppsigelse viktig?', options: ['Spare papir', 'Sikre bevis og rettssikkerhet', 'Vise politiet'], correct: 1 },
      { type: 'choice', q: 'Hva er fordelen med den nordiske modellen?', options: ['Lave skatter', 'Trygghet og stabilitet', 'Mindre jobb'], correct: 1 },
      { type: 'choice', q: 'Finn riktig påstand om diskriminering:', options: ['Det er greit i små bedrifter', 'Det skader samfunnet og kompetansen', 'Det har ingen effekt'], correct: 1 }
    ]
  }
];

// --- Task Renderer ---
const TaskRenderer = ({ task, onAnswer, userInput, setUserInput, feedback }) => {
  switch (task.type) {
    case 'choice':
      return (
        <div className="grid grid-cols-1 gap-3">
          {task.options.map((opt, i) => {
            const isCorrect = i === task.correct;
            let statusStyle = "border-slate-300 bg-white text-slate-800 hover:border-indigo-600 hover:bg-indigo-50";
            if (feedback) {
              if (isCorrect) statusStyle = "border-emerald-800 bg-emerald-900 text-white font-black shadow-lg ring-4 ring-emerald-100 scale-[1.02]";
              else statusStyle = "border-slate-200 bg-white text-slate-400 opacity-40";
            }
            return (
              <button 
                key={i} disabled={!!feedback}
                onClick={() => onAnswer(isCorrect)}
                className={`w-full p-4 text-left border-2 rounded-2xl transition-all font-bold text-lg flex justify-between items-center group active:scale-95 ${statusStyle}`}
              >
                {opt} 
                <ChevronRight className={feedback && isCorrect ? "text-emerald-200" : "text-slate-400"} size={20} />
              </button>
            );
          })}
        </div>
      );
    case 'tf':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button disabled={!!feedback} onClick={() => onAnswer(task.answer === true)} className={`p-8 border-4 rounded-[2rem] font-black text-2xl transition-all shadow-sm ${feedback && task.answer === true ? 'bg-emerald-900 border-emerald-950 text-white shadow-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'}`}>RETT</button>
          <button disabled={!!feedback} onClick={() => onAnswer(task.answer === false)} className={`p-8 border-4 rounded-[2rem] font-black text-2xl transition-all shadow-sm ${feedback && task.answer === false ? 'bg-emerald-900 border-emerald-950 text-white shadow-emerald-200' : 'bg-red-50 border-red-300 text-red-900 hover:bg-red-100'}`}>GALT</button>
        </div>
      );
    case 'blank':
      return (
        <div className="space-y-6">
          <div className="p-8 bg-slate-100 rounded-[1.5rem] border-2 border-slate-300 text-center font-bold text-slate-900 italic text-xl leading-relaxed">
            "{task.text.replace('[blank]', '_______')}"
          </div>
          <div className="flex flex-col gap-4 ">
            <input 
              autoFocus type="text" value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAnswer(userInput.toLowerCase().trim() === task.answer.toLowerCase())}
              className={`w-full p-4 border-4 rounded-2xl outline-none text-2xl font-black text-center uppercase shadow-inner transition-colors ${feedback ? 'bg-emerald-900 text-white border-emerald-950' : 'bg-white border-slate-300 focus:border-indigo-700 text-indigo-950'}`}
              placeholder="Skriv her..."
            />
            <button onClick={() => onAnswer(userInput.toLowerCase().trim() === task.answer.toLowerCase())} className="w-full py-4 bg-indigo-800 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-900 shadow-xl transition-all active:scale-95">SJEKK SVAR</button>
          </div>
        </div>
      );
    case 'sort-words':
      return <SortWordsTask task={task} onAnswer={onAnswer} feedback={feedback} />;
    case 'sort-paragraphs':
      return <SortParagraphsTask task={task} onAnswer={onAnswer} feedback={feedback} />;
    case 'drag-words':
      return <DragWordsTask task={task} onAnswer={onAnswer} feedback={feedback} />;
    default: return <div className="p-4 bg-red-100 text-red-900 rounded-xl font-bold text-sm">Feil: Ukjent oppgavetype</div>;
  }
};

// --- Main App ---
export default function App() {
  const [level, setLevel] = useState(null);
  const [gameState, setGameState] = useState('home'); 
  const [history, setHistory] = useState({}); 
  const [activeTheme, setActiveTheme] = useState(null);
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); 
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('arbeidsliv_history_v7');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const resetSession = () => {
    setScore(0); setLives(3); setStreak(0);
    setCurrentTaskIdx(0); setFeedback(null); setUserInput('');
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100 + (streak * 20));
      setStreak(s => s + 1);
    } else {
      setFeedback('wrong');
      setLives(l => l - 1);
      setStreak(0);
      if (lives <= 1) setTimeout(() => setGameState('gameover'), 800);
    }
  };

  const nextTask = () => {
    setFeedback(null); setUserInput('');
    if (currentTaskIdx < activeTheme.tasks.length - 1) {
      setCurrentTaskIdx(prev => prev + 1);
    } else {
      const key = `${level}-${activeTheme.id}`;
      const newHistory = { ...history, [key]: { score: Math.max(score, history[key]?.score || 0), completed: true } };
      setHistory(newHistory);
      localStorage.setItem('arbeidsliv_history_v7', JSON.stringify(newHistory));
      setGameState('summary');
    }
  };

  if (!level) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-2xl w-full space-y-10">
          <div className="space-y-4">
            <div className="bg-indigo-800 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-3 animate-bounce"><Trophy size={40} className="text-white" /></div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Arbeidslivs Portalen</h1>
            <p className="text-slate-700 font-bold text-xl max-w-xl mx-auto leading-tight">Interaktiv trening på norsk arbeidsliv.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['A2', 'B1'].map(l => (
              <button key={l} onClick={() => setLevel(l)} className="bg-white p-10 rounded-[3rem] border-b-[10px] border-slate-300 hover:border-indigo-700 hover:-translate-y-2 transition-all group shadow-xl active:translate-y-0 active:border-b-0">
                <div className={`w-16 h-16 ${l === 'A2' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                  <span className="text-3xl font-black">{l}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase">Nivå {l}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'home') {
    const themes = level === 'A2' ? coursesA2 : coursesB1;
    const completedCount = themes.filter(t => history[`${level}-${t.id}`]?.completed).length;
    return (
      <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-8 flex flex-col items-center font-sans">
        <div className="max-w-6xl w-full space-y-8">
          <header className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-4 text-center md:text-left">
              <button onClick={() => setLevel(null)} className="flex items-center gap-2 text-indigo-800 font-black text-sm uppercase tracking-widest hover:underline active:scale-95 transition-transform"><ChevronLeft size={20}/> Bytt nivå</button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Dashbord <span className="text-indigo-800">{level}</span></h1>
              <p className="text-slate-700 font-black text-base">Velg et tema for å starte.</p>
            </div>
            <div className="flex gap-6 items-center bg-indigo-50 p-6 rounded-[2rem] border-2 border-indigo-200 shadow-inner">
               <div className="text-right">
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Gjennomført</p>
                  <p className="text-4xl font-black text-indigo-900">{Math.round((completedCount/themes.length)*100)}%</p>
               </div>
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-indigo-100"><Trophy className="text-yellow-500" size={32} /></div>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {themes.map(t => {
              const stats = history[`${level}-${t.id}`];
              return (
                <button 
                  key={t.id} 
                  onClick={() => { setActiveTheme(t); resetSession(); setGameState('reading'); }} 
                  className="bg-white p-6 rounded-[2.5rem] border-b-[8px] border-slate-300 hover:border-indigo-700 hover:-translate-y-2 transition-all text-left shadow-xl flex flex-col min-h-[240px] active:translate-y-0 active:border-b-0 group"
                >
                  <div className={`w-12 h-12 ${t.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>{t.icon}</div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight flex-grow break-words mb-4">
                    {t.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100 mt-auto">
                    {stats?.completed ? (
                        <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase">
                            <CheckCircle2 size={20} /> Ferdig
                        </div>
                    ) : (
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">START</span>
                    )}
                    {stats?.score && <span className="text-sm font-black text-indigo-950 bg-indigo-100 px-2.5 py-0.5 rounded-xl border border-indigo-200">{stats.score}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'reading') {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col items-center font-sans">
        <div className="max-w-3xl w-full flex justify-between items-center mb-8">
           <button onClick={() => setGameState('home')} className="flex items-center gap-2 text-slate-700 font-black text-base uppercase tracking-widest hover:text-indigo-800 transition-colors"><Home size={20}/> Dashbord</button>
           <div className="bg-white px-6 py-2 rounded-full border-2 border-slate-300 text-xs font-black text-slate-700 tracking-[0.2em] uppercase shadow-md">Teoridel {level}</div>
        </div>
        <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`p-12 ${activeTheme.color} flex flex-col items-center text-center`}>
             <div className="p-6 bg-white rounded-[2rem] shadow-xl mb-6 transform -rotate-2 border-2 border-slate-100">{activeTheme.icon}</div>
             <h2 className="text-4xl font-black text-slate-950 tracking-tighter leading-tight uppercase">{activeTheme.title}</h2>
          </div>
          <div className="p-12">
            <div className="prose prose-lg text-slate-900 leading-relaxed mb-12 font-medium">
              {activeTheme.text.split('. ').map((s, i) => <p key={i} className="mb-6 text-xl text-slate-800">{s}{s.endsWith('.') ? '' : '.'}</p>)}
            </div>
            <button onClick={() => setGameState('playing')} className="w-full py-8 bg-indigo-800 text-white rounded-[2.5rem] font-black text-3xl hover:bg-indigo-900 shadow-xl flex items-center justify-center gap-6 transition-all active:scale-95 uppercase tracking-widest">Jeg er klar!</button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const task = activeTheme.tasks[currentTaskIdx];
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col items-center font-sans">
        <div className="max-w-3xl w-full flex items-center justify-between mb-8 px-4">
           <div className="flex gap-3">
             <button onClick={() => setGameState('home')} className="p-4 bg-white text-slate-800 border-2 border-slate-300 rounded-[1.2rem] hover:text-indigo-800 hover:shadow-xl transition-all active:scale-90 shadow-sm"><Home size={24}/></button>
             <button onClick={() => setGameState('reading')} className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-800 border-3 border-indigo-200 rounded-[1.2rem] hover:bg-indigo-50 font-black text-base uppercase tracking-widest shadow-md active:scale-95 transition-all"><Eye size={20}/> <span className="hidden sm:inline">Se tekst</span></button>
           </div>
           <div className="flex gap-2 bg-white p-3 rounded-[2rem] border-2 border-slate-200 shadow-md">
            {[...Array(3)].map((_, i) => <Heart key={i} size={32} fill={i < lives ? "#ef4444" : "none"} className={i < lives ? "text-red-600" : "text-slate-200"} />)}
          </div>
          <div className="text-right bg-white px-6 py-2 rounded-[1.5rem] shadow-md border-2 border-slate-200 min-w-[100px]">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Score</p>
             <p className="text-3xl font-black text-indigo-900 leading-none">{score}</p>
          </div>
        </div>
        <div className="max-w-3xl w-full px-4">
           <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden mb-10 p-1 shadow-inner border-2 border-slate-300">
             <div className="bg-indigo-700 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${((currentTaskIdx) / activeTheme.tasks.length) * 100}%` }} />
           </div>
           <div className="bg-white rounded-[3rem] p-10 shadow-xl relative border-2 border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
             {feedback && (
               <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 ${feedback === 'correct' ? 'bg-emerald-900' : 'bg-red-900'}`}>
                 <div className="text-center text-white p-10 max-w-xl">
                    {feedback === 'correct' ? (
                        <div className="space-y-6">
                            <div className="bg-white/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/40">
                                <Star size={100} fill="currentColor" className="text-yellow-400 animate-bounce" />
                            </div>
                            <h2 className="text-7xl font-black tracking-tighter uppercase text-white drop-shadow-lg">Riktig!</h2>
                            <p className="text-3xl font-bold text-white opacity-100">+100 poeng</p>
                            {streak > 1 && <div className="inline-block bg-white text-emerald-900 px-6 py-2 rounded-full text-xl font-black animate-pulse shadow-xl">🔥 {streak} STREAK!</div>}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/40">
                                <AlertTriangle size={100} className="text-white animate-pulse" />
                            </div>
                            <h2 className="text-7xl font-black tracking-tighter uppercase text-white drop-shadow-lg">Feil</h2>
                            <p className="text-2xl font-bold text-white opacity-100 leading-tight">Sjekk fagteksten på nytt for å finne svaret!</p>
                        </div>
                    )}
                    <button onClick={nextTask} className="mt-16 bg-white text-slate-950 px-20 py-6 rounded-[3rem] font-black text-3xl hover:scale-110 transition-transform shadow-2xl active:scale-95 border-b-[8px] border-slate-300 uppercase">Neste</button>
                 </div>
               </div>
             )}
             <div className="mb-10">
               <span className="text-sm font-black text-indigo-600 uppercase block mb-3 tracking-[0.3em]">Oppgave {currentTaskIdx + 1} av {activeTheme.tasks.length}</span>
               <h3 className="text-3xl font-black text-slate-950 leading-[1.2] tracking-tight">{task.q || 'Løs oppgaven'}</h3>
             </div>
             <div className="flex-grow">
                <TaskRenderer task={task} onAnswer={handleAnswer} userInput={userInput} setUserInput={setUserInput} feedback={feedback} />
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'summary' || gameState === 'gameover') {
    const isGameOver = gameState === 'gameover';
    return (
      <div className={`min-h-screen ${isGameOver ? 'bg-slate-950' : 'bg-[#f1f5f9]'} flex items-center justify-center p-6 text-center transition-colors duration-1000 font-sans`}>
        <div className="max-w-2xl w-full bg-white rounded-[4rem] p-16 shadow-2xl space-y-10 animate-in zoom-in duration-500 border-2 border-slate-200">
          <div className={`w-32 h-32 ${isGameOver ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-600'} rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border-2 border-white`}>
            {isGameOver ? <AlertTriangle size={80}/> : <Trophy size={80} />}
          </div>
          <div>
            <h2 className="text-6xl font-black text-slate-950 mb-4 tracking-tighter uppercase">{isGameOver ? 'Slutt' : 'Ferdig!'}</h2>
            <p className="text-slate-600 font-bold text-xl leading-relaxed">
              {isGameOver ? "Du gikk tom for liv. Prøv igjen!" : `Gratulerer! Temaet er fullført: ${activeTheme.title}`}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-slate-100 p-8 rounded-[2.5rem] shadow-inner border-2 border-slate-200"><p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Poengsum</p><p className="text-4xl font-black text-indigo-900">{score}</p></div>
             <div className="bg-slate-100 p-8 rounded-[2.5rem] shadow-inner border-2 border-slate-200"><p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Liv igjen</p><p className="text-4xl font-black text-emerald-800">{lives}</p></div>
          </div>
          <div className="space-y-4 pt-6">
            <button onClick={() => { resetSession(); setGameState('reading'); }} className={`w-full py-6 ${isGameOver ? 'bg-red-800 hover:bg-red-900 shadow-red-200' : 'bg-emerald-800 hover:bg-emerald-900 shadow-emerald-200'} text-white rounded-[2.5rem] font-black text-3xl shadow-2xl transition-all active:scale-95 border-b-[8px] border-black/20 uppercase`}>Prøv på nytt</button>
            <button onClick={() => setGameState('home')} className="w-full py-5 bg-slate-200 text-slate-900 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-6 hover:bg-slate-300 transition-all shadow-md active:scale-95 border-b-[6px] border-slate-400 uppercase tracking-widest"><Home size={32} /> Dashbord</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
