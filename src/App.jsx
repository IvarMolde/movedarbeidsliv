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
    <div className="space-y-8">
      {/* Word-Definition Pairs */}
      <div className="space-y-4">
        {task.pairs.map((p, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Word */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl border-2 border-indigo-950 font-black text-white text-center text-lg shadow-lg">
              {p.word}
            </div>
            
            {/* Drop Zone */}
            <div className={`p-5 rounded-2xl border-4 border-dashed min-h-16 flex items-center justify-center transition-all cursor-pointer ${
              dragSelections[i] 
                ? 'border-emerald-400 bg-emerald-50 shadow-lg ring-2 ring-emerald-200' 
                : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50'
            }`}>
              {dragSelections[i] ? (
                <button 
                  onClick={() => handleDragSelection(i, null)}
                  className="text-slate-900 font-black text-base flex items-center justify-between w-full gap-3 px-2"
                >
                  <span className="text-emerald-700">{dragSelections[i]}</span>
                  <RefreshCcw size={18} className="text-emerald-600"/>
                </button>
              ) : (
                <span className="text-slate-500 font-bold italic text-sm">Velg svar...</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Available Definitions */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 p-6 rounded-2xl border-2 border-slate-300 shadow-inner">
        <p className="text-xs font-black text-slate-700 uppercase mb-4 tracking-widest text-center">Tilgjengelige definisjoner:</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {shuffledDefs.map((def, i) => {
            const isUsed = Object.values(dragSelections).includes(def);
            return (
              <button 
                key={i}
                disabled={isUsed || feedback}
                onClick={() => {
                  const nextEmpty = task.pairs.findIndex((_, idx) => !dragSelections[idx]);
                  if (nextEmpty !== -1) handleDragSelection(nextEmpty, def);
                }}
                className={`px-4 py-2 rounded-xl font-black text-base transition-all border-2 shadow-md active:scale-90 ${
                  isUsed 
                    ? 'bg-slate-300 border-slate-300 text-slate-600 opacity-50 cursor-not-allowed' 
                    : 'bg-white border-slate-400 text-slate-900 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg cursor-pointer'
                }`}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>

      {/* Check Button */}
      <div className="flex justify-center pt-2">
        <button 
          onClick={checkDragWords}
          disabled={feedback}
          className="w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black text-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 uppercase tracking-wider"
        >
          Sjekk koblinger
        </button>
      </div>
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
      {/* Current Sentence */}
      <div className="min-h-24 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-3 border-dashed border-indigo-300 flex flex-wrap gap-3 items-center justify-center shadow-inner">
        {currentSort.map((w, i) => (
          <span key={i} className="px-4 py-2 bg-white rounded-xl shadow-md font-black text-indigo-900 text-lg border-2 border-indigo-100 animate-in zoom-in">
            {w}
          </span>
        ))}
        {currentSort.length === 0 && (
          <span className="text-indigo-500 font-bold italic text-lg">Klikk på ordene under i rekkefølge...</span>
        )}
      </div>

      {/* Available Words */}
      <div className="flex flex-wrap gap-3 justify-center">
        {task.shuffled.filter(w => {
          const countInSentence = task.shuffled.filter(x => x === w).length;
          const countInCurrent = currentSort.filter(x => x === w).length;
          return countInCurrent < countInSentence;
        }).map((w, i) => (
          <button 
            key={i} 
            disabled={feedback}
            onClick={() => handleWordClick(w)}
            className="px-6 py-3 bg-white border-2 border-slate-300 rounded-xl font-black text-lg text-slate-900 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg transition-all active:scale-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {w}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-2">
        <button 
          onClick={() => setCurrentSort([])} 
          disabled={feedback}
          className="flex items-center gap-2 text-slate-600 font-black text-sm uppercase tracking-widest hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-6 py-2 rounded-full active:scale-95 disabled:opacity-50 transition-all"
        >
          <RefreshCcw size={16}/> Start på nytt
        </button>
      </div>
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
    <div className="space-y-6">
      {/* Paragraph cards with position numbers */}
      <div className="space-y-4">
        {paraSort.map((p, i) => (
          <div 
            key={i}
            className={`flex items-center gap-4 p-6 rounded-2xl shadow-md border-2 transition-all group ${
              feedback 
                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-400' 
                : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg'
            }`}
          >
            {/* Position number */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
              feedback
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-700 group-hover:bg-indigo-200'
            }`}>
              {i + 1}
            </div>

            {/* Up/Down buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button 
                onClick={() => movePara(i, -1)}
                disabled={feedback}
                className="p-2 bg-slate-100 hover:bg-indigo-200 hover:text-indigo-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="rotate-90" size={18}/>
              </button>
              <button 
                onClick={() => movePara(i, 1)}
                disabled={feedback}
                className="p-2 bg-slate-100 hover:bg-indigo-200 hover:text-indigo-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="-rotate-90" size={18}/>
              </button>
            </div>

            {/* Paragraph Text */}
            <p className={`text-lg font-semibold leading-relaxed flex-grow ${
              feedback 
                ? 'text-emerald-900' 
                : 'text-slate-800'
            }`}>
              {p}
            </p>
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center pt-4">
        <button 
          onClick={() => onAnswer(JSON.stringify(paraSort) === JSON.stringify(task.paragraphs))}
          disabled={feedback}
          className="w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black text-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 uppercase tracking-wider"
        >
          Bekreft rekkefølge
        </button>
      </div>
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
        <div className="space-y-4">
          {task.options.map((opt, i) => {
            const isCorrect = i === task.correct;
            let styleClasses = "border-slate-300 bg-white text-slate-800 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg";
            if (feedback) {
              if (isCorrect) styleClasses = "border-emerald-600 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-900 font-black shadow-lg ring-2 ring-emerald-200 scale-[1.01]";
              else styleClasses = "border-slate-200 bg-slate-50 text-slate-400 opacity-50";
            }
            return (
              <button 
                key={i} 
                disabled={!!feedback}
                onClick={() => onAnswer(isCorrect)}
                className={`w-full p-5 text-left border-2 rounded-2xl transition-all font-bold text-lg flex justify-between items-center group active:scale-95 ${styleClasses}`}
              >
                <span className="flex-1">{opt}</span>
                {feedback && isCorrect && <CheckCircle2 size={24} className="text-emerald-600 ml-4" />}
                {!feedback && <ChevronRight className="text-slate-400 group-hover:text-indigo-600 ml-4" size={20} />}
              </button>
            );
          })}
        </div>
      );
    
    case 'tf':
      return (
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button 
            disabled={!!feedback} 
            onClick={() => onAnswer(task.answer === true)}
            className={`p-8 border-3 rounded-2xl font-black text-2xl transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300 ${feedback && task.answer === true ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg scale-105' : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'}`}
          >
            RETT
          </button>
          <button 
            disabled={!!feedback}
            onClick={() => onAnswer(task.answer === false)}
            className={`p-8 border-3 rounded-2xl font-black text-2xl transition-all focus:outline-none focus:ring-4 focus:ring-red-300 ${feedback && task.answer === false ? 'bg-red-600 border-red-700 text-white shadow-lg scale-105' : 'bg-red-50 border-red-300 text-red-900 hover:bg-red-100'}`}
          >
            GALT
          </button>
        </div>
      );
    
    case 'blank':
      return (
        <div className="space-y-6">
          <div className="p-8 bg-slate-100 rounded-2xl border-2 border-slate-300 text-center font-bold text-slate-900 text-lg leading-relaxed italic">
            "{task.text.replace('[blank]', '___________')}"
          </div>
          <div className="flex flex-col gap-4">
            <input 
              autoFocus 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAnswer(userInput.toLowerCase().trim() === task.answer.toLowerCase())}
              disabled={!!feedback}
              className={`w-full p-5 border-3 rounded-2xl outline-none text-2xl font-black text-center uppercase shadow-md transition-all focus:ring-4 ${feedback ? 'bg-emerald-100 text-emerald-900 border-emerald-400 focus:ring-emerald-300' : 'bg-white border-slate-300 focus:border-indigo-600 text-indigo-900 focus:ring-indigo-300'}`}
              placeholder="Skriv her..."
            />
            <button 
              onClick={() => onAnswer(userInput.toLowerCase().trim() === task.answer.toLowerCase())}
              disabled={!!feedback}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black text-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 uppercase tracking-wider disabled:opacity-50"
            >
              SJEKK SVAR
            </button>
          </div>
        </div>
      );
    
    case 'sort-words':
      return <SortWordsTask task={task} onAnswer={onAnswer} feedback={feedback} />;
    
    case 'sort-paragraphs':
      return <SortParagraphsTask task={task} onAnswer={onAnswer} feedback={feedback} />;
    
    case 'drag-words':
      return <DragWordsTask task={task} onAnswer={onAnswer} feedback={feedback} />;
    
    default: 
      return (
        <div className="p-6 bg-gradient-to-r from-red-100 to-red-50 text-red-900 rounded-2xl font-bold text-base border-2 border-red-300">
          ⚠️ Feil: Ukjent oppgavetype
        </div>
      );
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4 py-8 sm:py-16 font-sans overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center space-y-12 sm:space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 w-full">
            <div className="inline-flex items-center justify-center">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Trophy size={48} className="text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 bg-clip-text text-transparent tracking-tight">
                Arbeidslivs Portalen
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-semibold max-w-xl mx-auto leading-relaxed">
                Mestring av norsk arbeidsliv gjennom interaktiv trening
              </p>
            </div>
          </div>

          {/* CTA Text */}
          <div className="text-center">
            <p className="text-sm font-black text-indigo-600 uppercase tracking-widest letter-spacing-2">Velg ditt nivå</p>
          </div>

          {/* Level Selection */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {['A2', 'B1'].map((l, idx) => (
              <button 
                key={l} 
                onClick={() => setLevel(l)} 
                className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              >
                {/* Card Background */}
                <div className={`absolute inset-0 ${l === 'A2' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'}`}></div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center space-y-4 p-8">
                  <div className={`w-20 h-20 ${l === 'A2' ? 'bg-blue-400/30 border-blue-300' : 'bg-emerald-400/30 border-emerald-300'} rounded-2xl flex items-center justify-center border-2 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-4xl font-black text-white">{l}</span>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-black text-white">Nivå {l}</h3>
                    <p className={`text-sm font-semibold ${l === 'A2' ? 'text-blue-100' : 'text-emerald-100'}`}>
                      {l === 'A2' ? 'Grunnleggende arbeidsliv' : 'Avansert arbeidsliv'}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 group-hover:h-2 transition-all duration-300"></div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">Klikk for å starte</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'home') {
    const themes = level === 'A2' ? coursesA2 : coursesB1;
    const completedCount = themes.filter(t => history[`${level}-${t.id}`]?.completed).length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 sm:p-8 flex flex-col items-center font-sans">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Header Card */}
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-lg border border-white/20 flex flex-col sm:flex-row justify-between items-center gap-8">
              <div className="flex-1 text-center sm:text-left">
                <button onClick={() => setLevel(null)} className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest hover:text-indigo-700 active:scale-95 transition-all mb-4">
                  <ChevronLeft size={18}/> Tilbake
                </button>
                <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-indigo-900 to-blue-900 bg-clip-text text-transparent mb-3">
                  Nivå {level}
                </h1>
                <p className="text-lg text-slate-600 font-semibold">Velg et tema og begynn å lære</p>
              </div>
              
              <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100">
                <div className="text-center">
                  <p className="text-sm font-black text-indigo-600 uppercase tracking-wider mb-2">Fremdrift</p>
                  <div className="text-5xl font-black text-indigo-900">{Math.round((completedCount/themes.length)*100)}%</div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-full transition-all duration-500" style={{ width: `${Math.round((completedCount/themes.length)*100)}%` }}></div>
                </div>
                <p className="text-xs text-slate-600 font-semibold">{completedCount} av {themes.length} ferdig</p>
              </div>
            </div>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {themes.map(t => {
              const stats = history[`${level}-${t.id}`];
              const isCompleted = stats?.completed;
              
              return (
                <button 
                  key={t.id} 
                  onClick={() => { setActiveTheme(t); resetSession(); setGameState('reading'); }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-300 h-64"
                >
                  {/* Top color bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${t.color} bg-gradient-to-r from-transparent via-white to-transparent`}></div>
                  
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col p-6">
                    <div className={`w-12 h-12 ${t.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      {t.icon}
                    </div>
                    
                    <h3 className="text-lg font-black text-slate-900 leading-tight flex-grow mb-4 text-left">
                      {t.title}
                    </h3>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase">
                          <CheckCircle2 size={18} className="group-hover:animate-bounce" /> Fullført
                        </div>
                      ) : (
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Start</span>
                      )}
                      {stats?.score && (
                        <span className="text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1 rounded-lg">
                          {stats.score}
                        </span>
                      )}
                    </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8">
          {/* Navigation */}
          <div className="w-full flex justify-between items-center">
            <button 
              onClick={() => setGameState('home')} 
              className="inline-flex items-center gap-2 text-slate-600 font-bold text-sm uppercase tracking-widest hover:text-indigo-600 active:scale-90 transition-all px-4 py-2 rounded-lg hover:bg-white/50"
            >
              <Home size={20}/> Dashbord
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 text-xs font-black text-indigo-600 tracking-widest uppercase shadow-sm">
              Teoridel {level}
            </div>
          </div>

          {/* Content Card */}
          <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Color header */}
            <div className={`${activeTheme.color} p-8 sm:p-12 flex flex-col items-center text-center space-y-6`}>
              <div className="p-6 bg-white rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300 border-2 border-white/30">
                {activeTheme.icon}
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {activeTheme.title}
              </h2>
            </div>

            {/* Text Content */}
            <div className="p-8 sm:p-12 space-y-6">
              <div className="prose prose-lg max-w-none space-y-6 text-slate-800 leading-relaxed font-medium">
                {activeTheme.text.split('. ').map((s, i) => (
                  <p key={i} className="text-lg leading-relaxed text-slate-700">
                    {s}{s.endsWith('.') ? '' : '.'}
                  </p>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-8 flex justify-center">
                <button 
                  onClick={() => setGameState('playing')} 
                  className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black text-2xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 uppercase tracking-wider flex items-center gap-3"
                >
                  <Play size={28} /> Jeg er klar!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const task = activeTheme.tasks[currentTaskIdx];
    const progressPercent = ((currentTaskIdx) / activeTheme.tasks.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-3">
              <button 
                onClick={() => setGameState('home')} 
                className="p-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg transition-all active:scale-90 shadow-sm"
              >
                <Home size={24}/>
              </button>
              <button 
                onClick={() => setGameState('reading')} 
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 font-black text-sm uppercase tracking-widest shadow-sm transition-all active:scale-95"
              >
                <Eye size={20}/> Tekst
              </button>
            </div>
            
            {/* Lives */}
            <div className="flex gap-2 bg-white p-3 rounded-xl border-2 border-slate-200 shadow-sm">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative">
                  <Heart 
                    size={28} 
                    className={i < lives ? "text-red-500" : "text-slate-300"} 
                    fill={i < lives ? "#ef4444" : "none"}
                  />
                </div>
              ))}
            </div>
            
            {/* Score */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg font-black text-lg">
              {score}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-xs font-black text-slate-600 uppercase tracking-wider">
              <span>Oppgave {currentTaskIdx + 1} av {activeTheme.tasks.length}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner border border-slate-300">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 h-full rounded-full transition-all duration-500 ease-out shadow-lg" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {/* Main Task Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/50 relative overflow-hidden min-h-[600px] flex flex-col">
            {/* Feedback Overlay */}
            {feedback && (
              <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 ${feedback === 'correct' ? 'bg-gradient-to-br from-emerald-900 to-emerald-800' : 'bg-gradient-to-br from-red-900 to-red-800'}`}>
                <div className="text-center text-white p-8 max-w-xl space-y-6">
                  {feedback === 'correct' ? (
                    <>
                      <div className="bg-white/20 w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/40">
                        <Star size={100} fill="currentColor" className="text-yellow-300 animate-bounce" />
                      </div>
                      <h2 className="text-6xl sm:text-7xl font-black tracking-tight drop-shadow-lg">Riktig!</h2>
                      <p className="text-2xl font-bold opacity-95">+100 poeng</p>
                      {streak > 1 && (
                        <div className="inline-block bg-yellow-400 text-slate-900 px-8 py-3 rounded-full text-xl font-black animate-pulse shadow-xl">
                          🔥 {streak} STREAK!
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="bg-white/20 w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/40">
                        <AlertTriangle size={100} className="text-white animate-pulse" />
                      </div>
                      <h2 className="text-6xl sm:text-7xl font-black tracking-tight drop-shadow-lg">Feil</h2>
                      <p className="text-xl font-semibold opacity-95">Prøv på nytt!</p>
                    </>
                  )}
                  <button 
                    onClick={nextTask} 
                    className="mt-8 bg-white text-slate-950 px-12 py-4 rounded-xl font-black text-2xl hover:scale-105 transition-transform shadow-2xl active:scale-95 border-b-4 border-slate-300 uppercase tracking-wider"
                  >
                    Neste
                  </button>
                </div>
              </div>
            )}

            {/* Question */}
            <div className="mb-8 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight">
                {task.q || 'Løs oppgaven'}
              </h3>
            </div>

            {/* Task Content */}
            <div className="flex-grow">
              <TaskRenderer 
                task={task} 
                onAnswer={handleAnswer} 
                userInput={userInput} 
                setUserInput={setUserInput} 
                feedback={feedback} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'summary' || gameState === 'gameover') {
    const isGameOver = gameState === 'gameover';
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-1000 ${isGameOver ? 'bg-gradient-to-br from-slate-900 via-red-900 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50'}`}>
        <div className="w-full max-w-2xl mx-auto">
          <div className={`rounded-3xl p-12 sm:p-16 shadow-2xl space-y-8 animate-in zoom-in duration-500 border-2 ${isGameOver ? 'bg-slate-800 border-red-500/30' : 'bg-white border-white/50'}`}>
            {/* Icon */}
            <div className="flex justify-center">
              <div className={`w-48 h-48 rounded-3xl flex items-center justify-center shadow-2xl border-4 ${isGameOver ? 'bg-red-100/20 border-red-500/50' : 'bg-emerald-100/50 border-emerald-300'}`}>
                {isGameOver ? (
                  <AlertTriangle size={120} className="text-red-400 animate-pulse"/>
                ) : (
                  <Trophy size={120} className="text-emerald-600"/>
                )}
              </div>
            </div>

            {/* Title & Message */}
            <div className="text-center space-y-4">
              <h2 className={`text-6xl sm:text-7xl font-black tracking-tight ${isGameOver ? 'text-red-400' : 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent'}`}>
                {isGameOver ? 'Slutt' : 'Gratulerer!'}
              </h2>
              <p className={`text-lg sm:text-xl font-semibold leading-relaxed ${isGameOver ? 'text-slate-300' : 'text-slate-600'}`}>
                {isGameOver 
                  ? 'Du gikk tom for liv. Du klarte det bra - prøv på nytt!' 
                  : `Flott jobbet! Du har fullført ${activeTheme.title}`
                }
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className={`p-8 rounded-2xl text-center border-2 ${isGameOver ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200'}`}>
                <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isGameOver ? 'text-slate-400' : 'text-indigo-600'}`}>
                  Poengsum
                </p>
                <p className={`text-5xl font-black ${isGameOver ? 'text-slate-200' : 'text-indigo-900'}`}>
                  {score}
                </p>
              </div>
              <div className={`p-8 rounded-2xl text-center border-2 ${isGameOver ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'}`}>
                <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isGameOver ? 'text-slate-400' : 'text-emerald-600'}`}>
                  Liv igjen
                </p>
                <p className={`text-5xl font-black ${isGameOver ? 'text-slate-200' : 'text-emerald-900'}`}>
                  {lives}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <button 
                onClick={() => { resetSession(); setGameState('reading'); }}
                className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-wider transition-all active:scale-95 focus:outline-none focus:ring-4 ${isGameOver 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-300 shadow-lg' 
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:ring-emerald-300 shadow-lg'
                }`}
              >
                Prøv på nytt
              </button>
              <button 
                onClick={() => setGameState('home')}
                className="w-full py-5 bg-slate-200 text-slate-900 rounded-2xl font-black text-lg uppercase tracking-wider hover:bg-slate-300 transition-all shadow-md active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-300 flex items-center justify-center gap-3"
              >
                <Home size={24}/> Dashbord
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
