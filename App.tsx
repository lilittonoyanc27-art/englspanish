import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  Lightbulb, 
  Puzzle, 
  ChevronRight, 
  Trophy, 
  RefreshCcw, 
  Info,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Search,
  Book,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---

interface Cognate {
  id: number;
  english: string;
  armenian: string;
  spanish: string;
  rule: string;
  hint: string;
}

interface TheorySection {
  id: string;
  title: string;
  content: string;
  examples: { original: string; spanish: string; armenian: string }[];
  important?: string;
}

// --- Data ---

const COGNATES: Cognate[] = [
  { id: 1, english: "Music", armenian: "Մուսիկա", spanish: "Música", rule: "-ic → -ica", hint: "It sounds nearly identical in all three languages!" },
  { id: 2, english: "Problem", armenian: "Պրոբլեմ", spanish: "Problema", rule: "-em → -ema", hint: "In Spanish, words ending in -ma are often masculine (El problema)." },
  { id: 3, english: "Idea", armenian: "Իդեա", spanish: "Idea", rule: "Identical", hint: "Spanish spelling is the same as English!" },
  { id: 4, english: "Center", armenian: "Կենտրոն", spanish: "Centro", rule: "-er → -ro", hint: "Change the 'er' to 'ro' to make it Spanish." },
  { id: 5, english: "Museum", armenian: "Մուզեյ", spanish: "Museo", rule: "-um → -o", hint: "The 'um' becomes 'o' in Spanish." },
  { id: 6, english: "Radio", armenian: "Ռադիո", spanish: "Radio", rule: "Identical", hint: "Exactly the same sound and spelling." },
  { id: 7, english: "Family", armenian: "Ֆամիլիա", spanish: "Familia", rule: "-ly → -lia", hint: "Armenians often use this loanword in casual speech." },
  { id: 8, english: "Future", armenian: "Ֆուտուրո", spanish: "Futuro", rule: "-re → -ro", hint: "A very common root across Indo-European languages." },
  { id: 9, english: "Actor", armenian: "Ակտյոր", spanish: "Actor", rule: "Identical", hint: "Spelling is identical, just the accent is different." },
  { id: 10, english: "Nation", armenian: "Նացիա", spanish: "Nación", rule: "-tion → -ción", hint: "One of the most powerful Spanish learning hacks." },
  { id: 11, english: "Planet", armenian: "Պլանետա", spanish: "Planeta", rule: "Same Root", hint: "In Spanish it ends with 'a'." },
  { id: 12, english: "Natural", armenian: "Նատուրալ", spanish: "Natural", rule: "Identical", hint: "This word belongs to everyone!" },
  { id: 13, english: "Hospital", armenian: "Հիվանդանոց (Հոսպիտալ)", spanish: "Hospital", rule: "Identical", hint: "The 'H' is silent in Spanish." },
  { id: 14, english: "City", armenian: "Քաղաք", spanish: "Ciudad", rule: "-ty → -dad", hint: "Think of 'Activity' -> 'Actividad'." },
  { id: 15, english: "Animal", armenian: "Կենդանի (Անիմանալ)", spanish: "Animal", rule: "Identical", hint: "Spelling is exactly the same!" },
];

const THEORY_SECTIONS: TheorySection[] = [
  {
    id: "rules-intro",
    title: "1. Շատ բառեր նման են (Cognates)",
    content: "Անգլերենում և իսպաներենում կան հազարավոր նման բառեր։ Դրանք կոչվում են cognates — նույն արմատ ունեցող բառեր։ Այսպիսի բառերը շատ հեշտ է հիշել, որովհետև անգլերենը արդեն օգնում է։",
    examples: [
      { original: "information", spanish: "información", armenian: "ինֆորմացիա — տեղեկատվություն" },
      { original: "important", spanish: "importante", armenian: "կարևոր" },
      { original: "animal", spanish: "animal", armenian: "կենդանի" },
      { original: "hospital", spanish: "hospital", armenian: "հիվանդանոց" },
      { original: "hotel", spanish: "hotel", armenian: "հյուրանոց" },
      { original: "doctor", spanish: "doctor", armenian: "բժիշկ" },
      { original: "family", spanish: "familia", armenian: "ընտանիք" },
      { original: "music", spanish: "música", armenian: "երաժշտություն" },
    ]
  },
  {
    id: "rules-tion",
    title: "2. Անգլերեն -tion → իսպաներեն -ción",
    content: "Սա շատ լավ կանոն է երեխաների համար։ Եթե անգլերեն բառը վերջանում է -tion, իսպաներենում հաճախ կլինի -ción։",
    examples: [
      { original: "nation", spanish: "nación", armenian: "ազգ" },
      { original: "information", spanish: "información", armenian: "տեղեկատվություն" },
      { original: "education", spanish: "educación", armenian: "կրթություն" },
      { original: "conversation", spanish: "conversación", armenian: "զրույց" },
      { original: "organization", spanish: "organización", armenian: "կազմակերպություն" },
      { original: "celebration", spanish: "celebración", armenian: "տոնակատարություն" },
      { original: "operation", spanish: "operación", armenian: "գործողություն / վիրահատություն" },
    ]
  },
  {
    id: "rules-sion",
    title: "3. Անգլերեն -sion → իսպաներեն -sión",
    content: "Միայն պետք է հիշել, որ իսպաներենում դրվում է շեշտ՝ -sión / -ción։",
    examples: [
      { original: "decision", spanish: "decisión", armenian: "որոշում" },
      { original: "television", spanish: "televisión", armenian: "հեռուստատեսություն" },
      { original: "version", spanish: "versión", armenian: "տարբերակ" },
      { original: "profession", spanish: "profesión", armenian: "մասնագիտություն" },
      { original: "expression", spanish: "expresión", armenian: "արտահայտություն" },
    ]
  },
  {
    id: "rules-ty",
    title: "4. Անգլերեն -ty → իսպաներեն -dad",
    content: "Սա նույնպես շատ օգտակար կամուրջ է։",
    examples: [
      { original: "city", spanish: "ciudad", armenian: "քաղաք" },
      { original: "activity", spanish: "actividad", armenian: "գործունեություն" },
      { original: "university", spanish: "universidad", armenian: "համալսարան" },
      { original: "possibility", spanish: "posibilidad", armenian: "հնարավորություն" },
      { original: "reality", spanish: "realidad", armenian: "իրականություն" },
      { original: "quality", spanish: "calidad", armenian: "որակ" },
      { original: "curiosity", spanish: "curiosidad", armenian: "հետաքրքրասիրություն" },
    ]
  },
  {
    id: "rules-ic",
    title: "5. Անգլերեն -ic → իսպաներեն -ico / -ica",
    content: "Իսպաներենում ածականը համաձայնվում է սեռով։",
    examples: [
      { original: "basic", spanish: "básico / básica", armenian: "հիմնական" },
      { original: "classic", spanish: "clásico / clásica", armenian: "դասական" },
      { original: "romantic", spanish: "romántico / romántica", armenian: "ռոմանտիկ" },
      { original: "historic", spanish: "histórico / histórica", armenian: "պատմական" },
      { original: "economic", spanish: "económico / económica", armenian: "տնտեսական" },
    ],
    important: "Օրինակ՝ un libro clásico (դասական գիրք), una película clásica (դասական ֆիլմ)"
  },
  {
    id: "rules-al",
    title: "6. Անգլերեն -al → իսպաներեն -al",
    content: "Սրանք շատ հեշտ են, որովհետև գրեթե նույնն են։",
    examples: [
      { original: "normal", spanish: "normal", armenian: "նորմալ" },
      { original: "natural", spanish: "natural", armenian: "բնական" },
      { original: "local", spanish: "local", armenian: "տեղական" },
      { original: "personal", spanish: "personal", armenian: "անձնական" },
      { original: "animal", spanish: "animal", armenian: "կենդանի" },
      { original: "general", spanish: "general", armenian: "ընդհանուր" },
    ]
  },
  {
    id: "rules-ous",
    title: "7. Անգլերեն -ous → իսպաներեն -oso / -osa",
    content: "Անգլերեն -ous հաճախ դառնում է իսպաներեն -oso / -osa:",
    examples: [
      { original: "famous", spanish: "famoso / famosa", armenian: "հայտնի" },
      { original: "curious", spanish: "curioso / curiosa", armenian: "հետաքրքրասեր" },
      { original: "nervous", spanish: "nervioso / nerviosa", armenian: "նյարդային" },
      { original: "delicious", spanish: "delicioso / deliciosa", armenian: "համեղ" },
      { original: "dangerous", spanish: "peligroso / peligrosa", armenian: "վտանգավոր" },
    ],
    important: "Օրինակ՝ un hombre famoso (հայտնի տղամարդ), una mujer famosa (հայտնի կին)"
  },
  {
    id: "rules-ent",
    title: "8. Անգլերեն -ent / -ant → իսպաներեն -e",
    content: "Այս բառերը սովորաբար իսպաներենում ունեն վերջավորություն -e։",
    examples: [
      { original: "different", spanish: "diferente", armenian: "տարբեր" },
      { original: "important", spanish: "importante", armenian: "կարևոր" },
      { original: "elegant", spanish: "elegante", armenian: "նրբագեղ" },
      { original: "intelligent", spanish: "inteligente", armenian: "խելացի" },
      { original: "excellent", spanish: "excelente", armenian: "գերազանց" },
    ]
  },
  {
    id: "rules-verbs",
    title: "9. Որոշ բայեր նույնպես նման են",
    content: "Շատ իսպաներեն բայեր նման են անգլերեն բառերին։",
    examples: [
      { original: "to visit", spanish: "visitar", armenian: "այցելել" },
      { original: "to study", spanish: "estudiar", armenian: "սովորել" },
      { original: "to prepare", spanish: "preparar", armenian: "պատրաստել" },
      { original: "to use", spanish: "usar", armenian: "օգտագործել" },
      { original: "to need", spanish: "necesitar", armenian: "պետք ունենալ" },
      { original: "to decide", spanish: "decidir", armenian: "որոշել" },
      { original: "to organize", spanish: "organizar", armenian: "կազմակերպել" },
      { original: "to invite", spanish: "invitar", armenian: "հրավիրել" },
    ],
    important: "Օրինակ՝ I study Spanish -> Estudio español. I need water -> Necesito agua."
  },
  {
    id: "rules-order",
    title: "10. Նախադասության հիմնական կարգը",
    content: "Անգլերենում և իսպաներենում հիմնական կարգը հաճախ նույնն է՝ ենթակա + բայ + լրացում։ Բայց տարբերությունն այն է, որ իսպաներենում հաճախ կարող ենք չասել ենթական։",
    examples: [
      { original: "I study Spanish.", spanish: "Yo estudio español.", armenian: "Ես իսպաներեն եմ սովորում։" },
      { original: "She drinks coffee.", spanish: "Ella bebe café.", armenian: "Նա սուրճ է խմում։" },
      { original: "I study Spanish.", spanish: "Estudio español.", armenian: "Ես իսպաներեն եմ սովորում։ (առանց 'Yo'-ի)" },
    ]
  },
  {
    id: "rules-articles",
    title: "11. Article-ներ (Articles)",
    content: "Անգլերենում the, a/an են: Իսպաներենում հոդը կախված է սեռից և թվից։",
    examples: [
      { original: "the book", spanish: "el libro", armenian: "գիրքը" },
      { original: "the house", spanish: "la casa", armenian: "տունը" },
      { original: "a book", spanish: "un libro", armenian: "մի գիրք" },
      { original: "a house", spanish: "una casa", armenian: "մի տուն" },
    ],
    important: "el/la (the), un/una (a/an). Հոգնակի թիվ՝ los/las, unos/unas."
  },
  {
    id: "rules-adj",
    title: "12. Ածականների դիրքը",
    content: "Անգլերենում ածականը գալիս է գոյականից առաջ, իսպաներենում՝ հաճախ հետո։",
    examples: [
      { original: "a red car", spanish: "un coche rojo", armenian: "կարմիր մեքենա" },
      { original: "a big house", spanish: "una casa grande", armenian: "մեծ տուն" },
      { original: "a good friend", spanish: "un buen amigo", armenian: "լավ ընկեր (բացառություն)" },
    ]
  },
  {
    id: "rules-questions",
    title: "13. Հարցական բառեր",
    content: "Հարցական բառերը շատ նման են իմաստով։",
    examples: [
      { original: "What?", spanish: "¿Qué?", armenian: "Ի՞նչ" },
      { original: "Where?", spanish: "¿Dónde?", armenian: "Որտե՞ղ" },
      { original: "When?", spanish: "¿Cuándo?", armenian: "Ե՞րբ" },
      { original: "Who?", spanish: "¿Quién?", armenian: "Ո՞վ" },
      { original: "How?", spanish: "¿Cómo?", armenian: "Ինչպե՞ս" },
      { original: "How much?", spanish: "¿Cuánto?", armenian: "Որքա՞ն" },
    ],
    important: "¿Dónde estás? (Որտե՞ղ ես), ¿Qué quieres? (Ի՞նչ ես ուզում)"
  },
  {
    id: "rules-continuous",
    title: "14. Present Continuous",
    content: "Կառուցվածքը նման է՝ to be + verb-ing → estar + gerundio. Օգտագործվում է հենց “հիմա կատարվող” գործողության համար։",
    examples: [
      { original: "I am studying.", spanish: "Estoy estudiando.", armenian: "Ես սովորում եմ հիմա։" },
      { original: "She is eating.", spanish: "Ella está comiendo.", armenian: "Նա ուտում է հիմա։" },
      { original: "We are working.", spanish: "Estamos trabajando.", armenian: "Մենք աշխատում ենք հիմա։" },
    ]
  },
  {
    id: "rules-perfect",
    title: "15. Present Perfect",
    content: "Կառուցվածքը նման է՝ have + past participle → haber + participio։",
    examples: [
      { original: "I have eaten.", spanish: "He comido.", armenian: "Ես կերել եմ։" },
      { original: "I have studied.", spanish: "He estudiado.", armenian: "Ես սովորել եմ։" },
      { original: "We have lived in Spain.", spanish: "Hemos vivido en España.", armenian: "Մենք ապրել ենք Իսպանիայում։" },
    ]
  },
  {
    id: "rules-future",
    title: "16. Going to future",
    content: "Կառուցվածքը շատ նման է՝ am/is/are going to + verb → ir + a + infinitivo։",
    examples: [
      { original: "I am going to buy.", spanish: "Voy a comprar.", armenian: "Ես պատրաստվում եմ գնել։" },
      { original: "She is going to pay.", spanish: "Ella va a pagar.", armenian: "Նա վճարելու է։" },
      { original: "We are going to eat.", spanish: "Vamos a comer.", armenian: "Մենք ուտելու ենք։" },
    ]
  },
  {
    id: "rules-modals",
    title: "17. Modal բայեր (Modal verbs)",
    content: "Կառուցվածքը՝ modal / helper verb + infinitive. Իսպաներենում երկրորդ բայը մնում է անորոշ ձևով։",
    examples: [
      { original: "I can speak.", spanish: "Puedo hablar.", armenian: "Ես կարող եմ խոսել։" },
      { original: "I want to eat.", spanish: "Quiero comer.", armenian: "Ես ուզում եմ ուտել։" },
      { original: "I need to study.", spanish: "Necesito estudiar.", armenian: "Ես պետք է սովորեմ։" },
      { original: "I have to work.", spanish: "Tengo que trabajar.", armenian: "Ես պետք է աշխատեմ։" },
    ]
  },
  {
    id: "rules-hay",
    title: "18. “There is / there are” և “Hay”",
    content: "Շատ հարմար կամուրջ է՝ there is / there are = hay։ Իսպաներենում hay չի փոխվում եզակի/հոգնակի համար։",
    examples: [
      { original: "There is a book on the table.", spanish: "Hay un libro en la mesa.", armenian: "Սեղանի վրա գիրք կա։" },
      { original: "There are three people here.", spanish: "Hay tres personas aquí.", armenian: "Այստեղ երեք մարդ կա։" },
    ]
  },
  {
    id: "rules-possessives",
    title: "19. Possessives (Possessives)",
    content: "Տարբերությունը՝ իսպաներենում possessive-ը կարող է փոխվել թվով (mi/mis, tu/tus)։",
    examples: [
      { original: "my house", spanish: "mi casa", armenian: "իմ տունը" },
      { original: "your book", spanish: "tu libro", armenian: "քո գիրքը" },
      { original: "his car", spanish: "su coche", armenian: "նրա մեքենան" },
      { original: "our teacher", spanish: "nuestro profesor", armenian: "մեր ուսուցիչը" },
    ]
  },
  {
    id: "rules-prepositions",
    title: "20. Նախդիրներ (Prepositions)",
    content: "Որոշ նախդիրների գաղափարը նման է, բայց պետք է զգույշ լինել բառացի թարգմանության հետ։",
    examples: [
      { original: "in Madrid", spanish: "en Madrid", armenian: "Մադրիդում" },
      { original: "with my friend", spanish: "con mi amigo", armenian: "իմ ընկերոջ հետ" },
      { original: "without sugar", spanish: "sin azúcar", armenian: "առանց շաքարի" },
      { original: "to Spain", spanish: "a España", armenian: "Իսպանիա" },
    ]
  },
  {
    id: "rules-expressions",
    title: "21. Օգտակար արտահայտություններ",
    content: "Անգլերենով կարելի է բացատրել այս արտահայտությունները՝",
    examples: [
      { original: "Tener que = have to", spanish: "Tengo que estudiar.", armenian: "Ես պետք է սովորեմ։ (I have to study)" },
      { original: "Hay que = one must", spanish: "Hay que estudiar.", armenian: "Պետք է սովորել։ (It is necessary to study)" },
      { original: "Necesitar = need", spanish: "Necesito agua.", armenian: "Ինձ ջուր է պետք։ (I need water)" },
    ]
  },
  {
    id: "rules-be",
    title: "22. Ser / estar և “be”",
    content: "Անգլերենում կա մեկ բայ՝ to be։ Իսպաներենում՝ ser և estar։",
    examples: [
      { original: "I am a teacher.", spanish: "Soy profesor/a.", armenian: "Ես ուսուցիչ եմ։ (բնութագիր)" },
      { original: "I am tired.", spanish: "Estoy cansado/a.", armenian: "Ես հոգնած եմ։ (վիճակ)" },
    ],
    important: "ser — ով ես, ինչ է դա / estar — վիճակ, տեղ, ժամանակավոր դրություն"
  },
  {
    id: "false-friends",
    title: "23. False friends — զգույշ եղեք!",
    content: "Կան բառեր, որոնք նման են անգլերենին, բայց իմաստը տարբեր է։",
    examples: [
      { original: "embarazada (≠ embarrassed)", spanish: "embarazada", armenian: "հղի" },
      { original: "actualmente (≠ actually)", spanish: "actualmente", armenian: "ներկայումս" },
      { original: "asistir (≠ assist)", spanish: "asistir", armenian: "ներկա լինել / մասնակցել" },
      { original: "realizar (≠ realize)", spanish: "realizar", armenian: "իրականացնել" },
      { original: "sensible (≠ sensible)", spanish: "sensible", armenian: "զգայուն" },
    ],
    important: "Սրանք պետք է առանձին սովորել, որովհետև արտաքինից խաբուսիկ են։"
  },
  {
    id: "summary-7-bridges",
    title: "24. Ամենալավ 7 “կամուրջները”",
    content: "Դասի համար կարող ես տալ այս 7 “կամուրջները”.",
    examples: [
      { original: "1. -tion → -ción", spanish: "información", armenian: "information" },
      { original: "2. -ty → -dad", spanish: "universidad", armenian: "university" },
      { original: "3. going to → ir a", spanish: "Voy a comprar", armenian: "I am going to buy" },
      { original: "4. have + V3 → haber", spanish: "He comido", armenian: "I have eaten" },
      { original: "5. there is / there are", spanish: "hay", armenian: "hay" },
      { original: "6. have to → tener que", spanish: "Tengo que estudiar", armenian: "I have to study" },
      { original: "7. can + verb → poder", spanish: "Puedo hablar", armenian: "I can speak" },
    ]
  },
  {
    id: "for-students",
    title: "25. Բացատրություն աշակերտների համար",
    content: "Անգլերենը կարող է շատ օգնել իսպաներեն սովորելիս, որովհետև շատ բառեր նման են։ Անգլերենը արդեն քեզ գիտելիք է տալիս։",
    examples: [
      { original: "family", spanish: "familia", armenian: "ընտանիք" },
      { original: "I am going to buy.", spanish: "Voy a comprar.", armenian: "Ես պատրաստվում եմ գնել։" },
      { original: "There is a book.", spanish: "Hay un libro.", armenian: "Գիրք կա։" },
    ],
    important: "Բայց պետք է զգույշ լինել false friends-ից. embarazada = հղի, ոչ թե embarrassed!"
  }
];


// Combine cognates and theory examples for a searchable dictionary
const DICTIONARY_DATA = [
  ...COGNATES.map(c => ({ word: c.spanish, en: c.english, am: c.armenian })),
  ...THEORY_SECTIONS.flatMap(s => s.examples.map(e => ({ word: e.spanish, en: e.original, am: e.armenian })))
].filter((v, i, a) => a.findIndex(t => t.word === v.word) === i); // Deduplicate

// --- Components ---

export default function App() {
  const [view, setView] = useState<'intro' | 'theory' | 'dictionary' | 'game' | 'result'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [scrambled, setScrambled] = useState<{char: string, id: number}[]>([]);
  const [score, setScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDictionary = useMemo(() => {
    return DICTIONARY_DATA.filter(item => 
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.am.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Initialize a puzzle level
  const initPuzzle = useCallback((index: number) => {
    const word = COGNATES[index].spanish.toUpperCase().replace(/\s/g, '');
    const letters = word.split('').map((char, i) => ({ char, id: Math.random() + i }));
    setScrambled([...letters].sort(() => Math.random() - 0.5));
    setUserInput([]);
  }, []);

  useEffect(() => {
    if (view === 'game' && currentLevel < COGNATES.length) {
      initPuzzle(currentLevel);
    }
  }, [view, currentLevel, initPuzzle]);

  const handleTileClick = (letter: string, tileId: number) => {
    const targetWord = COGNATES[currentLevel].spanish.toUpperCase().replace(/\s/g, '');
    const nextCharIndex = userInput.length;
    
    if (letter === targetWord[nextCharIndex]) {
      const newUserInput = [...userInput, letter];
      setUserInput(newUserInput);
      setScrambled(scrambled.filter(t => t.id !== tileId));

      if (newUserInput.length === targetWord.length) {
        setScore(s => s + 10);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#5A5A40', '#FF6321', '#F5F2ED']
        });
        
        setTimeout(() => {
          if (currentLevel < COGNATES.length - 1) {
            setCurrentLevel(l => l + 1);
          } else {
            setView('result');
          }
        }, 1200);
      }
    } else {
      const element = document.getElementById(`tile-${tileId}`);
      if (element) {
        element.classList.add('animate-shake');
        setTimeout(() => element.classList.remove('animate-shake'), 400);
      }
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setView('game');
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans selection:bg-[#5A5A40] selection:text-white overflow-x-hidden">
      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#5A5A40] rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6321] rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 py-12 min-h-screen flex flex-col z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView('intro')}
          >
            <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Languages size={28} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-medium tracking-tight">Cognado Connect</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">ES • EN • AM Bridges</p>
            </div>
          </motion.div>
          {view !== 'intro' && (
            <button 
              onClick={() => setView('intro')}
              className="text-[10px] uppercase tracking-widest bg-black/5 hover:bg-black/10 px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-bold"
            >
              <X size={12} /> Close
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {/* INTRO VIEW */}
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center gap-10"
            >
              <div className="space-y-4">
                <h2 className="text-6xl font-serif leading-[1.1] text-balance">
                  Language <br />
                  <span className="italic text-[#5A5A40]">Bridges.</span>
                </h2>
                <p className="text-xl text-black/60 leading-relaxed max-w-md">
                  Այո, իսպաներենը և անգլերենը շատ նմանություններ ունեն։ Սա ձեր կամուրջն է դեպի նոր լեզու։
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setView('theory')}
                  className="group relative w-full h-20 bg-white border-2 border-black rounded-[2rem] flex items-center justify-between px-8 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                >
                  <span className="flex items-center gap-5">
                    <BookOpen className="text-[#FF6321]" size={28} />
                    <span className="text-lg font-bold">Theory & Rules (Տեսություն)</span>
                  </span>
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>

                <button 
                  onClick={() => setView('dictionary')}
                  className="group relative w-full h-20 bg-white border-2 border-black rounded-[2rem] flex items-center justify-between px-8 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                >
                  <span className="flex items-center gap-5">
                    <Book className="text-[#5A5A40]" size={28} />
                    <span className="text-lg font-bold">Dictionary (Բառարան)</span>
                  </span>
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>

                <button 
                  onClick={resetGame}
                  className="group relative w-full h-20 bg-[#5A5A40] text-white rounded-[2rem] flex items-center justify-between px-8 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(26,26,26,0.3)] active:translate-y-0 active:shadow-none shadow-xl"
                >
                  <span className="flex items-center gap-5">
                    <Puzzle size={28} />
                    <span className="text-lg font-bold">Start Puzzle (Խաղալ)</span>
                  </span>
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-4 opacity-30 justify-center grayscale py-8">
                <img src="https://flagcdn.com/w40/es.png" alt="ES" className="w-6" />
                <img src="https://flagcdn.com/w40/gb.png" alt="GB" className="w-6" />
                <img src="https://flagcdn.com/w40/am.png" alt="AM" className="w-6" />
              </div>
            </motion.div>
          )}

          {/* THEORY VIEW */}
          {view === 'theory' && (
            <motion.div 
              key="theory"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30 flex items-center gap-2">
                   Theoretical Bridge
                </h3>
                <h2 className="text-4xl font-serif italic">The Secret Connections</h2>
                <div className="p-6 bg-[#FF6321] text-white rounded-3xl shadow-xl">
                  <p className="text-lg font-medium leading-relaxed">
                    Անգլերենը կարող է շատ օգնել իսպաներեն սովորելիս, որովհետև շատ բառեր նման են։
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                {THEORY_SECTIONS.map((section, idx) => (
                  <motion.section 
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#5A5A40] text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <h3 className="text-2xl font-serif">{section.title}</h3>
                    </div>
                    
                    <p className="text-black/60 italic px-4 border-l-4 border-[#FF6321]">
                      {section.content}
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                      {section.examples.map((ex, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm border border-black/5 hover:border-[#5A5A40] transition-colors">
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest opacity-40 font-black">Original (EN)</p>
                            <p className="font-bold text-lg">{ex.original}</p>
                          </div>
                          <ArrowRight className="hidden sm:block opacity-20" />
                          <div className="space-y-1 sm:text-center">
                            <p className="text-xs uppercase tracking-widest text-[#FF6321] font-black">Spanish (ES)</p>
                            <p className="text-2xl font-serif italic">{ex.spanish}</p>
                          </div>
                          <div className="space-y-1 sm:text-right">
                            <p className="text-xs uppercase tracking-widest opacity-40 font-black">Armenian (AM)</p>
                            <p className="font-medium text-black/70">{ex.armenian}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {section.important && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800 text-sm">
                        <AlertTriangle className="shrink-0" size={20} />
                        <p>{section.important}</p>
                      </div>
                    )}
                  </motion.section>
                ))}
              </div>

              <div className="py-10 text-center">
                <button 
                  onClick={() => setView('game')}
                  className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-bold hover:-translate-y-1 transition-all"
                >
                  Start Practicing <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* DICTIONARY VIEW */}
          {view === 'dictionary' && (
            <motion.div 
              key="dictionary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col gap-8"
            >
              <div className="space-y-4 text-center">
                <h2 className="text-4xl font-serif">Bridge Dictionary</h2>
                <p className="opacity-50">Search for cognates in English, Spanish, or Armenian</p>
              </div>

              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" />
                <input 
                  type="text" 
                  placeholder="Search word..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-white border-2 border-black rounded-3xl pl-16 pr-6 font-medium focus:ring-4 focus:ring-[#5A5A40]/10 outline-none transition-all"
                />
              </div>

              <div className="grid gap-3">
                {filteredDictionary.length > 0 ? (
                  filteredDictionary.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-black/5"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-2xl font-serif italic text-[#5A5A40]">{item.word}</p>
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider opacity-40">
                          <span>EN: {item.en}</span>
                          <span>AM: {item.am}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                        <Info size={16} className="opacity-30" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-30 italic">
                    No bridges found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* GAME VIEW */}
          {view === 'game' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              className="flex-1 flex flex-col gap-14"
            >
              {/* Stats Rail */}
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-[200px] h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#5A5A40]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentLevel) / COGNATES.length) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">Progress</p>
                    <p className="text-sm font-serif font-bold">Level {currentLevel + 1} of {COGNATES.length}</p>
                  </div>
                  <div className="w-[1px] h-8 bg-black/10" />
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">Score</p>
                    <p className="text-sm font-serif font-bold">{score}</p>
                  </div>
                </div>
              </div>

              {/* Challenge Card */}
              <div className="text-center space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={COGNATES[currentLevel].id}
                    initial={{ y: 30, opacity: 0, rotateX: 45 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -30, opacity: 0, rotateX: -45 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="space-y-6"
                  >
                     <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase tracking-[.4em] font-black opacity-20">Translate Word</span>
                        <h3 className="text-7xl font-serif italic tracking-tighter lowercase">{COGNATES[currentLevel].english}</h3>
                     </div>
                    
                    <div className="flex justify-center gap-4">
                      <div className="bg-white px-6 py-2.5 rounded-full text-sm font-semibold border border-black/5 shadow-sm flex items-center gap-2">
                        <span className="opacity-30">AM:</span> {COGNATES[currentLevel].armenian}
                      </div>
                      <div className="group relative">
                        <div className="bg-black/5 hover:bg-black/10 w-10 h-10 rounded-full flex items-center justify-center cursor-help transition-colors">
                          <HelpCircle size={18} className="opacity-40" />
                        </div>
                        <div className="absolute bottom-[130%] left-1/2 -translate-x-1/2 w-48 p-4 bg-black text-white text-[11px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50 text-left">
                           <p className="mb-1 uppercase tracking-widest font-black text-[#FF6321]">Hint</p>
                           {COGNATES[currentLevel].hint}
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Word Assembly Slot */}
              <div className="flex flex-wrap justify-center gap-4 py-4 min-h-[5rem]">
                {COGNATES[currentLevel].spanish.toUpperCase().replace(/\s/g, '').split('').map((char, i) => (
                  <motion.div 
                    key={i}
                    animate={userInput[i] ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
                    className={`w-14 h-18 border-2 flex items-center justify-center text-3xl font-serif italic font-black rounded-2xl transition-all duration-300 ${
                      userInput[i] 
                        ? 'border-[#5A5A40] bg-white text-[#5A5A40] shadow-md' 
                        : 'border-black/5 bg-black/[0.02] text-transparent'
                    }`}
                  >
                    {userInput[i]}
                  </motion.div>
                ))}
              </div>

              {/* Alphabet Blocks */}
              <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto pt-4">
                {scrambled.map((tile) => (
                  <motion.button
                    key={tile.id}
                    id={`tile-${tile.id}`}
                    layoutId={`tile-${tile.id}`}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTileClick(tile.char, tile.id)}
                    className="w-14 h-14 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-xl font-black transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                  >
                    {tile.char}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT VIEW */}
          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-12 text-center"
            >
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-56 h-56 bg-[#5A5A40] rounded-[4rem] rotate-12 flex items-center justify-center text-white shadow-2xl"
                >
                  <Trophy size={100} className="-rotate-12" />
                </motion.div>
                <div className="absolute -top-6 -right-6 bg-[#FF6321] text-white px-6 py-2 rounded-full font-black shadow-xl rotate-12">
                   100% Correct
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl font-serif italic leading-none">¡Increíble!</h2>
                <p className="text-xl opacity-60 max-w-xs mx-auto">
                  You've mastered the language bridge between English, Armenian, and Spanish.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full px-8">
                <button 
                  onClick={resetGame}
                  className="flex-1 h-16 bg-[#1A1A1A] text-white rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <RefreshCcw size={20} /> Play Again
                </button>
                <button 
                  onClick={() => setView('intro')}
                  className="flex-1 h-16 bg-white border-2 border-black rounded-2xl font-bold hover:-translate-y-1 transition-all"
                >
                   Main Menu
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer Rail */}
      <footer className="relative max-w-2xl mx-auto px-6 py-10 opacity-30 mt-auto">
        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.4em]">
          <p>Cognado Connect v2.0</p>
          <div className="flex gap-6">
            <span className="hover:opacity-100 cursor-default">EN</span>
            <span className="hover:opacity-100 cursor-default underline text-[#FF6321]">ES</span>
            <span className="hover:opacity-100 cursor-default">AM</span>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) rotate(-2deg); }
          50% { transform: translateX(4px) rotate(2deg); }
          75% { transform: translateX(-4px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
          border-color: #ef4444 !important;
          background-color: #fef2f2 !important;
          color: #ef4444 !important;
          box-shadow: 4px 4px 0px 0px rgba(239, 68, 68, 1) !important;
        }
      `}} />
    </div>
  );
}
