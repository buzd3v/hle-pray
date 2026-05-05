import type { Language } from "@/types/prayer";

export interface NavLink {
  label: string;
  href: string;
}

export interface RosterMember {
  id: string;
  role: "top" | "jungle" | "mid" | "adc" | "support";
  ign: string;
  name: string;
  bio: Record<Language, string>;
  quote: string;
  image: string;
}

export interface AchievementCard {
  id: string;
  title: string;
  year: string;
  badge: string;
  description: string;
  image: string;
}

export interface MusicTrack {
  id: string;
  label: string;
  src: string;
}

interface SiteCopy {
  brand: string;
  tagline: string;
  hero: {
    title: string;
    eyebrow: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    statLabel: string;
    statSuffix: string;
  };
  prayer: {
    title: string;
    subtitle: string;
    presets: string[];
    placeholder: string;
    submit: string;
    success: string;
    nameLabel: string;
    namePlaceholder: string;
    anonymous: string;
    musicLabel: string;
    musicOn: string;
    musicOff: string;
  };
  roster: {
    title: string;
    subtitle: string;
    eyebrow: string;
  };
  achievements: {
    title: string;
    subtitle: string;
    eyebrow: string;
  };
  wishes: {
    title: string;
    subtitle: string;
    empty: string;
    topSupporters: string;
    burning: string;
  };
  footer: string;
  nav: NavLink[];
}

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string; flag: string }> = [
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
];

export const SITE_COPY: Record<Language, SiteCopy> = {
  vi: {
    brand: "HLE PRAYER",
    tagline: "Thắp nến nguyện cầu cho Hanwha Life Esports",
    hero: {
      title: "THẮP NẾN NGUYỆN CẦU",
      eyebrow: "Beyond the Challenge",
      description:
        "Gửi lời nguyện đến Hanwha Life Esports, giữ lửa cho một mùa giải bùng nổ và để từng ngọn nến chở hy vọng bay tới đội tuyển.",
      primaryCta: "Đi tới khu cầu nguyện",
      secondaryCta: "Xem đội hình HLE 2026",
      statLabel: "lượt thắp nến",
      statSuffix: "ngọn nến đang cháy",
    },
    prayer: {
      title: "LỜI CẦU NGUYỆN",
      subtitle: "Chọn sẵn một câu hoặc tự viết lời nguyện của riêng bạn cho HLE.",
      presets: [
        "HLE vô địch LCK mùa này",
        "Zeus bùng nổ ở đường trên",
        "Kanavi kiểm soát hoàn toàn nhịp độ trận đấu",
        "Zeka tạo ra khác biệt ở mid",
        "Gumayusi gánh team bằng những pha xử lý lạnh lùng",
        "Delight mở giao tranh hoàn hảo",
      ],
      placeholder: "Viết lời cầu nguyện của riêng bạn...",
      submit: "Thắp nến",
      success: "Lời nguyện đã được thắp sáng!",
      nameLabel: "Tên",
      namePlaceholder: "Tên của bạn (tùy chọn)",
      anonymous: "Ẩn danh",
      musicLabel: "Âm nhạc",
      musicOn: "Đang bật",
      musicOff: "Đang tắt",
    },
    roster: {
      title: "ĐỘI HÌNH HLE 2026",
      subtitle: "Một khung riêng cho đội hình, ảnh, trích dẫn và tiểu sử để bạn thay asset sau.",
      eyebrow: "Roster",
    },
    achievements: {
      title: "DANH HIỆU VÀ CỘT MỐC",
      subtitle: "Khung danh hiệu để bạn thay ảnh, năm và chi tiết theo đúng bộ asset sau này.",
      eyebrow: "Trophy room",
    },
    wishes: {
      title: "BỨC THƯ NGUYỆN",
      subtitle: "Những lời nguyện vừa được thắp lên cho HLE.",
      empty: "Chưa có lời nguyện nào, hãy thắp ngọn nến đầu tiên.",
      topSupporters: "TOP NGƯỜI THẮP NẾN",
      burning: "đang cháy",
    },
    footer: "Good Game, HLE Fam 💛",
    nav: [
      { label: "Trang chủ", href: "#section-home" },
      { label: "Cầu nguyện", href: "#section-prayer" },
      { label: "Đội hình", href: "#section-roster" },
      { label: "Danh hiệu", href: "#section-achievements" },
      { label: "Bức thư", href: "#section-wishes" },
    ],
  },
  en: {
    brand: "HLE PRAYER",
    tagline: "Light a candle for Hanwha Life Esports",
    hero: {
      title: "LIGHT A CANDLE",
      eyebrow: "Beyond the Challenge",
      description:
        "Send your wishes to Hanwha Life Esports, keep the fire alive for a huge season, and let every candle carry hope to the team.",
      primaryCta: "Go to prayer area",
      secondaryCta: "View HLE 2026 roster",
      statLabel: "candles lit",
      statSuffix: "candles burning",
    },
    prayer: {
      title: "PRAYER BOARD",
      subtitle: "Pick a preset quote or write your own message for HLE.",
      presets: [
        "HLE wins the LCK this season",
        "Zeus dominates the top lane",
        "Kanavi controls the entire tempo",
        "Zeka creates mid lane gaps",
        "Gumayusi delivers clutch late-game carries",
        "Delight starts perfect fights",
      ],
      placeholder: "Write your own prayer...",
      submit: "Light candle",
      success: "Your prayer has been lit!",
      nameLabel: "Name",
      namePlaceholder: "Your name (optional)",
      anonymous: "Anonymous",
      musicLabel: "Music",
      musicOn: "Playing",
      musicOff: "Muted",
    },
    roster: {
      title: "HLE 2026 ROSTER",
      subtitle: "A dedicated frame for roster, images, quotes and bios you can swap later.",
      eyebrow: "Roster",
    },
    achievements: {
      title: "ACHIEVEMENTS & MILESTONES",
      subtitle: "A trophy wall you can update with the final image set, years and notes later.",
      eyebrow: "Trophy room",
    },
    wishes: {
      title: "PRAYER LETTERS",
      subtitle: "Recent wishes sent to HLE.",
      empty: "No prayers yet. Light the first candle.",
      topSupporters: "TOP SUPPORTERS",
      burning: "burning",
    },
    footer: "Good Game, HLE Fam 💛",
    nav: [
      { label: "Home", href: "#section-home" },
      { label: "Prayer", href: "#section-prayer" },
      { label: "Roster", href: "#section-roster" },
      { label: "Achievements", href: "#section-achievements" },
      { label: "Letters", href: "#section-wishes" },
    ],
  },
  ko: {
    brand: "HLE PRAYER",
    tagline: "한화생명e스포츠를 위한 촛불 기도",
    hero: {
      title: "촛불을 밝히자",
      eyebrow: "Beyond the Challenge",
      description:
        "한화생명e스포츠에게 마음을 전하고, 빛나는 시즌을 위해 희망을 촛불에 담아 보내세요.",
      primaryCta: "기도 구역으로 이동",
      secondaryCta: "HLE 2026 로스터 보기",
      statLabel: "개의 촛불",
      statSuffix: "타오르는 촛불",
    },
    prayer: {
      title: "기도판",
      subtitle: "미리 준비된 문구를 고르거나 HLE를 위한 나만의 기도를 작성하세요.",
      presets: [
        "HLE가 이번 시즌 LCK를 제패하길",
        "Zeus가 탑 라인을 장악하길",
        "Kanavi가 경기 템포를 지배하길",
        "Zeka가 미드 차이를 만들길",
        "Gumayusi가 결정적인 후반 캐리를 하길",
        "Delight가 완벽한 이니시를 열길",
      ],
      placeholder: "나만의 기도문을 작성하세요...",
      submit: "촛불 켜기",
      success: "기도가 밝혀졌습니다!",
      nameLabel: "이름",
      namePlaceholder: "이름 (선택)",
      anonymous: "익명",
      musicLabel: "음악",
      musicOn: "재생 중",
      musicOff: "음소거",
    },
    roster: {
      title: "HLE 2026 로스터",
      subtitle: "이후에 이미지, 인용문, 소개를 교체하기 쉬운 전용 프레임입니다.",
      eyebrow: "로스터",
    },
    achievements: {
      title: "업적과 명예",
      subtitle: "나중에 최종 이미지와 연도, 상세 내용을 바꾸기 쉬운 트로피 월입니다.",
      eyebrow: "트로피 룸",
    },
    wishes: {
      title: "기도 편지",
      subtitle: "HLE에게 보내진 최근 기도들입니다.",
      empty: "아직 기도가 없습니다. 첫 촛불을 밝혀보세요.",
      topSupporters: "상위 기도자",
      burning: "타오르는 중",
    },
    footer: "Good Game, HLE Fam 💛",
    nav: [
      { label: "홈", href: "#section-home" },
      { label: "기도", href: "#section-prayer" },
      { label: "로스터", href: "#section-roster" },
      { label: "업적", href: "#section-achievements" },
      { label: "편지", href: "#section-wishes" },
    ],
  },
};

export const ROSTER_MEMBERS: RosterMember[] = [
  {
    id: "zeus",
    role: "top",
    ign: "Zeus",
    name: "Choi Woo-je",
    bio: {
      vi: "Giữ đường trên bằng kỹ năng táo bạo và áp lực đơn đường ổn định.",
      en: "Anchors the top lane with fearless mechanics and steady side-lane pressure.",
      ko: "대담한 피지컬과 안정적인 사이드 압박으로 탑 라인을 지탱합니다.",
    },
    quote: "Leave me the hard lane and I will create the opening.",
    image: "/hle-zeus.jpg",
  },
  {
    id: "kanavi",
    role: "jungle",
    ign: "Kanavi",
    name: "Seo Jin-hyeok",
    bio: {
      vi: "Kiểm soát khu rừng với nhịp độ dồn dập, đường di chuyển gọn và pha mở giao tranh dứt khoát.",
      en: "Controls the jungle with relentless tempo, clean routes, and decisive engages.",
      ko: "빠른 템포와 정교한 동선, 과감한 교전 개시로 정글을 지배합니다.",
    },
    quote: "I set the pace, and the map follows.",
    image: "/hle-kanavi.jpg",
  },
  {
    id: "zeka",
    role: "mid",
    ign: "Zeka",
    name: "Kim Geon-woo",
    bio: {
      vi: "Tạo áp lực đường giữa bùng nổ, những lựa chọn quyết định và đọc giao tranh đầy tự tin.",
      en: "Brings explosive mid-lane pressure, clutch picks, and fearless teamfight reads.",
      ko: "폭발적인 미드 압박과 결정적인 픽, 자신감 있는 한타 판단을 보여줍니다.",
    },
    quote: "The mid lane is where momentum turns into victory.",
    image: "/hle-zeka.jpg",
  },
  {
    id: "gumayusi",
    role: "adc",
    ign: "Gumayusi",
    name: "Lee Min-hyeong",
    bio: {
      vi: "Chuẩn xác ở cuối trận, cơ học đỉnh cao và áp lực gánh đội bền bỉ.",
      en: "Late-game precision, elite mechanics, and unwavering carry pressure.",
      ko: "후반 운영의 정밀함과 최고 수준의 피지컬, 흔들림 없는 캐리 압박을 보여줍니다.",
    },
    quote: "Give me one window, and I will take the game.",
    image: "/hle-gumayusi.jpg",
  },
  {
    id: "delight",
    role: "support",
    ign: "Delight",
    name: "Ryu Min-seok",
    bio: {
      vi: "Mở nhịp giao tranh, bảo kê đồng đội và thực hiện teamfight gọn gàng.",
      en: "Sets the pace for engages, peel, and clean teamfight execution.",
      ko: "교전 타이밍을 열고 아군을 보호하며 깔끔한 한타를 완성합니다.",
    },
    quote: "A clean engage is the start of a clean win.",
    image: "/hle-delight.jpg",
  },
];

export const ACHIEVEMENT_CARDS: AchievementCard[] = [
  {
    id: "lck-run",
    title: "LCK Storyline",
    year: "2025",
    badge: "League run",
    description: "A frame for your final trophy assets, series captions, and victory photos.",
    image: "/hle-achievement-lck.jpg",
  },
  {
    id: "msi-stage",
    title: "MSI Stage",
    year: "2025",
    badge: "International",
    description: "Capture the team on the international stage with the exact match artwork later.",
    image: "/hle-achievement-msi.jpg",
  },
  {
    id: "worlds-dream",
    title: "Worlds Dream",
    year: "2026",
    badge: "Global chase",
    description: "A polished slot for Worlds ambitions, quotes, and the image you will add later.",
    image: "/hle-achievement-worlds.jpg",
  },
  {
    id: "legacy",
    title: "Team Legacy",
    year: "2026",
    badge: "Legacy",
    description: "Reserve this card for legacy milestones, milestones captions, and banner art.",
    image: "/hle-achievement-legacy.jpg",
  },
];

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "ambient",
    label: "Ambient prayer",
    src: "/bgm-ambient.mp3",
  },
  {
    id: "celebration",
    label: "Victory surge",
    src: "/bgm-thanks.mp3",
  },
];

export const DEFAULT_LANGUAGE: Language = "vi";
