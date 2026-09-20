/**
 * PLACEHOLDER CATALOGUE. NOCTURNE is a concept brand: these lots do not exist and nothing is for sale.
 * Region facts (altitude ranges, common varieties, usual processing) are typical for each region, not claims about a farm.
 * Names are the Arabic names of night stars.
 */
import type { MethodId } from "./brew";

export type Roast = 1 | 2 | 3 | 4 | 5; // 1 lightest .. 5 darkest

export type Coffee = {
  slug: string;
  n: string;
  name: string;
  /** what the star name means, one short line */
  star: string;
  country: string;
  region: string;
  altitude: string;
  variety: string;
  process: "مغسولة" | "مجففة" | "عسلية" | "خلطة";
  roast: Roast;
  notes: [string, string, string];
  line: string;
  body: string;
  method: MethodId;
  /** a real café photo (credits in public/images/CREDITS.md) */
  image: string;
  /** object-position, so the cup stays in frame when the photo is cropped */
  focus: string;
};

export const ROAST_LABEL: Record<Roast, string> = {
  1: "تحميص فاتح",
  2: "فاتح إلى وسط",
  3: "تحميص وسط",
  4: "وسط إلى داكن",
  5: "تحميص داكن",
};

export const COFFEES: Coffee[] = [
  {
    slug: "suhail",
    n: "01",
    name: "سُهيل",
    star: "النجم الذي يبشّر طلوعه بانكسار الحر",
    country: "إثيوبيا",
    region: "يرغاتشيف",
    altitude: "1,800 – 2,200 م",
    variety: "سلالات إثيوبية محلية",
    process: "مغسولة",
    roast: 1,
    notes: ["ياسمين", "برغموت", "خوخ"],
    line: "كوب زهري خفيف، أقرب إلى الشاي منه إلى القهوة الثقيلة.",
    body: "قهوة مغسولة من المرتفعات الإثيوبية، نحمّصها تحميصاً فاتحاً حتى تبقى الزهور والحمضيات واضحة. أفضل ما تكون مقطّرة وبلا إضافات.",
    method: "v60",
    image: "/images/cup-suhail.webp",
    focus: "82% 50%",
  },
  {
    slug: "thuraya",
    n: "02",
    name: "الثريّا",
    star: "عنقود النجوم السبعة",
    country: "كولومبيا",
    region: "ويلا",
    altitude: "1,500 – 2,000 م",
    variety: "كاتورا وكاستيو",
    process: "مغسولة",
    roast: 2,
    notes: ["كراميل", "تفاح أحمر", "شوكولاتة بالحليب"],
    line: "متوازنة وحلوة، الكوب الذي يرضي الجميع.",
    body: "حلاوة كراميل وحموضة تفاح ناعمة. تحميصها بين الفاتح والوسط يجعلها مناسبة للتقطير وللإسبريسو معاً.",
    method: "v60",
    image: "/images/cup-thuraya.webp",
    focus: "56% 50%",
  },
  {
    slug: "alnasr",
    n: "03",
    name: "النَّسر",
    star: "النسر الواقع، من ألمع نجوم الصيف",
    country: "اليمن",
    region: "حراز",
    altitude: "1,900 – 2,400 م",
    variety: "سلالات يمنية محلية",
    process: "مجففة",
    roast: 3,
    notes: ["فواكه مجففة", "هيل", "كاكاو"],
    line: "من مدرّجات الجبال التي خرجت منها القهوة إلى العالم.",
    body: "تُجفَّف الكرزات كاملةً تحت الشمس فتأخذ القهوة حلاوة الفواكه المجففة ونكهة توابل دافئة. كوب عميق بقوام ممتلئ.",
    method: "french-press",
    image: "/images/cup-alnasr.webp",
    focus: "78% 50%",
  },
  {
    slug: "alshira",
    n: "04",
    name: "الشِّعرى",
    star: "ألمع نجم في سماء الليل",
    country: "كينيا",
    region: "نييري",
    altitude: "1,600 – 1,900 م",
    variety: "SL28 و SL34",
    process: "مغسولة",
    roast: 2,
    notes: ["توت أسود", "جريب فروت", "سكر أسمر"],
    line: "حموضة لامعة ونهاية طويلة.",
    body: "قهوة كينية مغسولة بحموضة واضحة تشبه التوت والحمضيات. تظهر أفضل ما فيها مقطّرة، وتصنع كولد برو منعشاً.",
    method: "cold-brew",
    image: "/images/cup-alshira.webp",
    focus: "24% 50%",
  },
  {
    slug: "aldabaran",
    n: "05",
    name: "الدَّبران",
    star: "النجم الأحمر الذي يتبع الثريّا",
    country: "البرازيل",
    region: "سيرادو",
    altitude: "900 – 1,250 م",
    variety: "كاتواي وبوربون أصفر",
    process: "مجففة",
    roast: 4,
    notes: ["بندق", "شوكولاتة داكنة", "دبس"],
    line: "قوام كثيف وحموضة منخفضة، صُنعت للإسبريسو.",
    body: "مكسرات وشوكولاتة وقوام ثقيل. تتحمل الحليب جيداً وتعطي كريما كثيفة في الإسبريسو.",
    method: "espresso",
    image: "/images/cup-aldabaran.webp",
    focus: "50% 70%",
  },
  {
    slug: "midnight",
    n: "06",
    name: "منتصف الليل",
    star: "خلطة البيت",
    country: "البرازيل وكولومبيا",
    region: "خلطة من محصولين",
    altitude: "900 – 2,000 م",
    variety: "خلطة",
    process: "خلطة",
    roast: 5,
    notes: ["شوكولاتة داكنة", "جوز", "كراميل محروق"],
    line: "الأغمق عندنا. كوب آخر الليل.",
    body: "خلطة الإسبريسو الخاصة بنا: قاعدة برازيلية ثقيلة تضيف إليها الكولومبية حلاوتها. تحميص داكن بلا مرارة محروقة.",
    method: "espresso",
    image: "/images/cup-midnight.webp",
    focus: "52% 60%",
  },
];

export const getCoffee = (slug: string) => COFFEES.find((c) => c.slug === slug);
