/**
 * Brew guides. Ratios, temperatures and times are common starting points used widely in specialty coffee,
 * not rules: the page says so. `ratio` is grams of water per gram of coffee.
 */
export type MethodId = "v60" | "espresso" | "french-press" | "cold-brew" | "saudi";

export type Method = {
  id: MethodId;
  name: string;
  latin: string;
  line: string;
  ratio: number;
  /** what the calculator's amount means for this method */
  amountLabel: string;
  unit: "مل" | "غ";
  min: number;
  max: number;
  step: number;
  start: number;
  temp: string;
  grind: string;
  time: string;
  steps: string[];
  note?: string;
};

export const METHODS: Method[] = [
  {
    id: "v60",
    name: "التقطير",
    latin: "V60",
    line: "كوب نظيف يُظهر نكهات المحصول بوضوح.",
    ratio: 16,
    amountLabel: "كمية الماء",
    unit: "مل",
    min: 200,
    max: 800,
    step: 20,
    start: 320,
    temp: "92 – 96°م",
    grind: "متوسطة إلى ناعمة",
    time: "2:30 – 3:00",
    steps: [
      "اشطف الفلتر بالماء الساخن وسخّن القمع والكوب.",
      "أضف القهوة المطحونة وسوِّ سطحها.",
      "اسكب ضعف وزن القهوة ماءً وانتظر 30 إلى 45 ثانية حتى تتفتّح.",
      "أكمل السكب بحركة دائرية هادئة حتى تصل إلى الوزن الكامل قرابة الدقيقة 1:45.",
      "اترك الماء ينزل. ينتهي التقطير قرابة الدقيقة الثالثة.",
    ],
  },
  {
    id: "espresso",
    name: "الإسبريسو",
    latin: "Espresso",
    line: "قليل ومركّز، بكريما كثيفة.",
    ratio: 2,
    amountLabel: "وزن الناتج في الكوب",
    unit: "غ",
    min: 28,
    max: 44,
    step: 2,
    start: 36,
    temp: "92 – 94°م",
    grind: "ناعمة",
    time: "25 – 30 ثانية",
    steps: [
      "سخّن المجموعة والكوب.",
      "اطحن القهوة ووزّعها بالتساوي في السلة ثم اكبسها بشكل مستوٍ.",
      "ابدأ الاستخلاص وضع الكوب على ميزان.",
      "أوقفه عندما يصل الناتج إلى ضعف وزن القهوة تقريباً.",
      "إذا انتهى قبل 25 ثانية فنعّم الطحنة، وإذا تجاوز 30 ثانية فخشّنها.",
    ],
  },
  {
    id: "french-press",
    name: "الفرنش برس",
    latin: "French press",
    line: "قوام ممتلئ وكوب دافئ بلا تعقيد.",
    ratio: 15,
    amountLabel: "كمية الماء",
    unit: "مل",
    min: 250,
    max: 1000,
    step: 50,
    start: 500,
    temp: "93 – 96°م",
    grind: "خشنة",
    time: "4:00",
    steps: [
      "سخّن الإبريق بالماء الساخن ثم أفرغه.",
      "أضف القهوة واسكب كل الماء دفعة واحدة.",
      "حرّك مرة واحدة برفق وضع الغطاء دون أن تكبس.",
      "انتظر أربع دقائق.",
      "اكبس ببطء واسكب القهوة كلها فوراً حتى لا يستمر الاستخلاص.",
    ],
  },
  {
    id: "cold-brew",
    name: "الكولد برو",
    latin: "Cold brew",
    line: "مركّز بارد، حلو وقليل الحموضة.",
    ratio: 8,
    amountLabel: "كمية الماء",
    unit: "مل",
    min: 400,
    max: 1600,
    step: 100,
    start: 800,
    temp: "ماء بارد",
    grind: "خشنة",
    time: "12 – 18 ساعة في الثلاجة",
    steps: [
      "ضع القهوة المطحونة في وعاء زجاجي نظيف.",
      "اسكب الماء البارد وحرّك حتى تبتلّ القهوة كلها.",
      "غطِّ الوعاء واتركه في الثلاجة من 12 إلى 18 ساعة.",
      "صفِّ القهوة بفلتر ورقي أو قماش ناعم.",
    ],
    note: "الناتج مركّز: خفّفه بمقدار مساوٍ من الماء أو الحليب مع الثلج.",
  },
  {
    id: "saudi",
    name: "القهوة السعودية",
    latin: "Saudi coffee",
    line: "تحميص فاتح وهيل، تُقدَّم في الفنجال مع التمر.",
    ratio: 33,
    amountLabel: "كمية الماء",
    unit: "مل",
    min: 500,
    max: 2000,
    step: 100,
    start: 1000,
    temp: "غليان هادئ",
    grind: "خشنة",
    time: "10 – 15 دقيقة",
    steps: [
      "اغلِ الماء في الدلة أو الإبريق.",
      "أضف القهوة المحمّصة تحميصاً فاتحاً واتركها تغلي على نار هادئة من 10 إلى 15 دقيقة.",
      "ارفعها عن النار وأضف الهيل المطحون، والزعفران لمن يحب.",
      "اتركها دقائق حتى تركد ثم صفِّها في الدلة.",
    ],
    note: "تختلف الوصفة من منطقة إلى منطقة ومن بيت إلى بيت. هذه نقطة بداية فقط.",
  },
];

export const getMethod = (id: string | undefined) => METHODS.find((m) => m.id === id);
