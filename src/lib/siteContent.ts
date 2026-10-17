import type { Language } from "@/types/prayer";

export interface NavLink {
  label: string;
  href: string;
}

export interface RosterTitle {
  year: string;
  event: string;
  team: string;
  result: "champion" | "gold";
}

export interface RosterAward {
  year: string;
  name: string;
}

export interface RosterMember {
  id: string;
  role: "top" | "jungle" | "mid" | "adc" | "support";
  ign: string;
  name: string;
  bio: Record<Language, string>;
  quote: string;
  image: string;
  /** CSS background-position that keeps the player centred in the portrait card crop. */
  imagePosition: string;
  detailImage: string;
  titles: RosterTitle[];
  awards: RosterAward[];
}

export const ROSTER_MODAL_COPY: Record<
  Language,
  { titles: string; awards: string; close: string; champion: string; gold: string; viewDetail: string; source: string }
> = {
  vi: {
    titles: "Danh hiệu đồng đội",
    awards: "Giải thưởng cá nhân",
    close: "Đóng",
    champion: "Vô địch",
    gold: "Huy chương vàng",
    viewDetail: "Xem thành tích",
    source: "Nguồn: Liquipedia, Leaguepedia, Wikipedia",
  },
  en: {
    titles: "Team titles",
    awards: "Individual awards",
    close: "Close",
    champion: "Champion",
    gold: "Gold medal",
    viewDetail: "View achievements",
    source: "Sources: Liquipedia, Leaguepedia, Wikipedia",
  },
  ko: {
    titles: "팀 우승 기록",
    awards: "개인 수상",
    close: "닫기",
    champion: "우승",
    gold: "금메달",
    viewDetail: "업적 보기",
    source: "출처: Liquipedia, Leaguepedia, Wikipedia",
  },
};

export interface AchievementCard {
  id: string;
  title: string;
  year: string;
  badge: string;
  description: Record<Language, string>;
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
    subtitle: string;
    eyebrow: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  grove: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pickButton: string;
    picking: string;
    hint: string;
    greeting: string;
    handed: string;
    wishFirst: string;
    alreadyHave: string;
    writeWish: string;
    thanksTitle: string;
    thanksBody: string;
    thanksClose: string;
    steps: [string, string, string];
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
    wallTag: string;
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
    brand: "HLE LUCKY ORANGE",
    tagline: "Cam Trao Tay – May Mắn Đong Đầy",
    hero: {
      title: "CAM TRAO TAY",
      subtitle: "MAY MẮN ĐONG ĐẦY",
      eyebrow: "Beyond the Challenge",
      description:
        "Cùng Soori hái một quả cam may mắn, gửi lời chúc đến Hanwha Life Esports và để may mắn đong đầy cho cả một mùa giải rực rỡ.",
      primaryCta: "Đến vườn cam của Soori",
      secondaryCta: "Xem đội hình HLE 2026",
    },
    grove: {
      eyebrow: "Soori's orange grove",
      title: "VƯỜN CAM CỦA SOORI",
      subtitle:
        "Chạm vào quả cam trên cây hoặc bấm nút Hái cam, Soori sẽ trao cam may mắn cho bạn.",
      pickButton: "Hái cam",
      picking: "Soori đang hái cam...",
      hint: "Chạm vào một quả cam trên cây để hái",
      greeting: "Chào bạn! Hái một quả cam may mắn nhé 🍊",
      handed: "Cam của bạn đây! Giờ hãy để lại lời chúc cho HLE nhé 💛",
      wishFirst: "Cảm ơn lời chúc! Để Soori hái cam tặng bạn nhé 🍊",
      alreadyHave: "Bạn đã có cam rồi, giờ hãy gửi lời chúc cho HLE nào!",
      writeWish: "Viết lời chúc",
      thanksTitle: "Soori cảm ơn bạn!",
      thanksBody:
        "Quả cam may mắn và lời chúc của bạn đã được trao đến HLE. Chúc bạn thật nhiều may mắn, và hẹn gặp lại ở vườn cam nhé!",
      thanksClose: "Hái thêm cam",
      steps: ["Hái cam", "Gửi lời chúc", "Nhận may mắn"],
    },
    prayer: {
      title: "LỜI CHÚC CHO HLE",
      subtitle: "Chọn sẵn một câu hoặc tự viết lời chúc của riêng bạn cho HLE.",
      presets: [
        "HLE vô địch Worlds mùa này",
        "Zeus bùng nổ ở đường trên",
        "Kanavi kiểm soát hoàn toàn nhịp độ trận đấu",
        "Zeka tạo ra khác biệt ở mid",
        "Gumayusi gánh team bằng những pha xử lý lạnh lùng",
        "Delight mở giao tranh hoàn hảo",
      ],
      placeholder: "Viết lời chúc của riêng bạn...",
      submit: "Gửi lời chúc",
      success: "Lời chúc đã được gửi!",
      nameLabel: "Tên",
      namePlaceholder: "Tên của bạn (tùy chọn)",
      anonymous: "Ẩn danh",
      musicLabel: "Âm nhạc",
      musicOn: "Đang bật",
      musicOff: "Đang tắt",
      wallTag: "HLE 2026 lucky orange wall",
    },
    roster: {
      title: "ĐỘI HÌNH HLE 2026",
      subtitle: "Một khung riêng cho đội hình, ảnh, trích dẫn và tiểu sử để bạn thay asset sau.",
      eyebrow: "Roster",
    },
    achievements: {
      title: "DANH HIỆU VÀ CỘT MỐC",
      subtitle: "Những chiếc cúp của Hanwha Life Esports từ năm 2024 đến nay.",
      eyebrow: "Trophy room",
    },
    wishes: {
      title: "BỨC THƯ LỜI CHÚC",
      subtitle: "Những lời chúc vừa được gửi đến HLE cùng quả cam may mắn.",
      empty: "Chưa có lời chúc nào, hãy là người đầu tiên hái cam.",
      burning: "đã trao cam",
    },
    footer: "Good Game, HLE Fam 🍊",
    nav: [
      { label: "Trang chủ", href: "#section-home" },
      { label: "Vườn cam", href: "#section-prayer" },
      { label: "Đội hình", href: "#section-roster" },
      { label: "Danh hiệu", href: "#section-achievements" },
      { label: "Lời chúc", href: "#section-wishes" },
    ],
  },
  en: {
    brand: "HLE LUCKY ORANGE",
    tagline: "Orange in Hand – Luck Overflowing",
    hero: {
      title: "ORANGE IN HAND",
      subtitle: "LUCK OVERFLOWING",
      eyebrow: "Beyond the Challenge",
      description:
        "Pick a lucky orange with Soori, send your wishes to Hanwha Life Esports, and let good luck overflow for a brilliant season.",
      primaryCta: "Visit Soori's orange grove",
      secondaryCta: "View HLE 2026 roster",
    },
    grove: {
      eyebrow: "Soori's orange grove",
      title: "SOORI'S ORANGE GROVE",
      subtitle:
        "Tap an orange on the tree or press Pick orange and Soori will hand you a lucky one.",
      pickButton: "Pick orange",
      picking: "Soori is picking an orange...",
      hint: "Tap an orange on the tree to pick it",
      greeting: "Hi there! Pick a lucky orange 🍊",
      handed: "Here's your orange! Now leave a wish for HLE 💛",
      wishFirst: "Thanks for the wish! Let Soori pick an orange for you 🍊",
      alreadyHave: "You already have an orange, now send HLE a wish!",
      writeWish: "Write a wish",
      thanksTitle: "Thank you from Soori!",
      thanksBody:
        "Your lucky orange and your wish are on their way to HLE. Wishing you lots of luck, see you again in the grove!",
      thanksClose: "Pick more oranges",
      steps: ["Pick an orange", "Send a wish", "Receive luck"],
    },
    prayer: {
      title: "WISHES FOR HLE",
      subtitle: "Pick a preset quote or write your own wish for HLE.",
      presets: [
        "HLE wins Worlds this season",
        "Zeus dominates the top lane",
        "Kanavi controls the entire tempo",
        "Zeka creates mid lane gaps",
        "Gumayusi delivers clutch late-game carries",
        "Delight starts perfect fights",
      ],
      placeholder: "Write your own wish...",
      submit: "Send wish",
      success: "Your wish has been sent!",
      nameLabel: "Name",
      namePlaceholder: "Your name (optional)",
      anonymous: "Anonymous",
      musicLabel: "Music",
      musicOn: "Playing",
      musicOff: "Muted",
      wallTag: "HLE 2026 lucky orange wall",
    },
    roster: {
      title: "HLE 2026 ROSTER",
      subtitle: "A dedicated frame for roster, images, quotes and bios you can swap later.",
      eyebrow: "Roster",
    },
    achievements: {
      title: "ACHIEVEMENTS & MILESTONES",
      subtitle: "Hanwha Life Esports' trophies from 2024 to today.",
      eyebrow: "Trophy room",
    },
    wishes: {
      title: "WISH LETTERS",
      subtitle: "Recent wishes sent to HLE with a lucky orange.",
      empty: "No wishes yet. Be the first to pick an orange.",
      burning: "gave an orange",
    },
    footer: "Good Game, HLE Fam 🍊",
    nav: [
      { label: "Home", href: "#section-home" },
      { label: "Orange grove", href: "#section-prayer" },
      { label: "Roster", href: "#section-roster" },
      { label: "Achievements", href: "#section-achievements" },
      { label: "Wishes", href: "#section-wishes" },
    ],
  },
  ko: {
    brand: "HLE LUCKY ORANGE",
    tagline: "손에 건네는 오렌지 – 가득 채우는 행운",
    hero: {
      title: "손에 건네는 오렌지",
      subtitle: "가득 채우는 행운",
      eyebrow: "Beyond the Challenge",
      description:
        "수리와 함께 행운의 오렌지를 따고, 한화생명e스포츠에게 응원 메시지를 보내 빛나는 시즌에 행운을 가득 채워 주세요.",
      primaryCta: "수리의 오렌지 농장으로",
      secondaryCta: "HLE 2026 로스터 보기",
    },
    grove: {
      eyebrow: "Soori's orange grove",
      title: "수리의 오렌지 농장",
      subtitle:
        "나무의 오렌지를 누르거나 오렌지 따기 버튼을 누르면 수리가 행운의 오렌지를 건네줘요.",
      pickButton: "오렌지 따기",
      picking: "수리가 오렌지를 따고 있어요...",
      hint: "나무에 달린 오렌지를 눌러 따 보세요",
      greeting: "안녕하세요! 행운의 오렌지를 따 보세요 🍊",
      handed: "오렌지 여기 있어요! 이제 HLE에게 응원 메시지를 남겨 주세요 💛",
      wishFirst: "응원 고마워요! 수리가 오렌지를 따 줄게요 🍊",
      alreadyHave: "이미 오렌지가 있어요, 이제 HLE에게 응원 메시지를 보내요!",
      writeWish: "응원 메시지 쓰기",
      thanksTitle: "수리가 고마워해요!",
      thanksBody:
        "행운의 오렌지와 응원 메시지가 HLE에게 전달되었어요. 행운이 가득하길 바라요, 농장에서 또 만나요!",
      thanksClose: "오렌지 더 따기",
      steps: ["오렌지 따기", "응원 보내기", "행운 받기"],
    },
    prayer: {
      title: "HLE 응원 메시지",
      subtitle: "미리 준비된 문구를 고르거나 HLE를 위한 나만의 응원 메시지를 작성하세요.",
      presets: [
        "HLE가 이번 시즌 월드 챔피언십을 제패하길",
        "Zeus가 탑 라인을 장악하길",
        "Kanavi가 경기 템포를 지배하길",
        "Zeka가 미드 차이를 만들길",
        "Gumayusi가 결정적인 후반 캐리를 하길",
        "Delight가 완벽한 이니시를 열길",
      ],
      placeholder: "나만의 응원 메시지를 작성하세요...",
      submit: "응원 보내기",
      success: "응원 메시지가 전달되었습니다!",
      nameLabel: "이름",
      namePlaceholder: "이름 (선택)",
      anonymous: "익명",
      musicLabel: "음악",
      musicOn: "재생 중",
      musicOff: "음소거",
      wallTag: "HLE 2026 lucky orange wall",
    },
    roster: {
      title: "HLE 2026 로스터",
      subtitle: "이후에 이미지, 인용문, 소개를 교체하기 쉬운 전용 프레임입니다.",
      eyebrow: "로스터",
    },
    achievements: {
      title: "업적과 명예",
      subtitle: "2024년부터 현재까지 한화생명e스포츠가 들어 올린 트로피입니다.",
      eyebrow: "트로피 룸",
    },
    wishes: {
      title: "응원 편지",
      subtitle: "행운의 오렌지와 함께 HLE에게 보내진 최근 응원 메시지입니다.",
      empty: "아직 응원 메시지가 없습니다. 첫 오렌지를 따 보세요.",
      burning: "오렌지 전달",
    },
    footer: "Good Game, HLE Fam 🍊",
    nav: [
      { label: "홈", href: "#section-home" },
      { label: "오렌지 농장", href: "#section-prayer" },
      { label: "로스터", href: "#section-roster" },
      { label: "업적", href: "#section-achievements" },
      { label: "응원", href: "#section-wishes" },
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
    image: "/roster/zeus.jpg",
    imagePosition: "50% 50%",
    detailImage: "/zeus_detail.jpg",
    titles: [
      { year: "2026", event: "Mid-Season Invitational", team: "HLE", result: "champion" },
      { year: "2025", event: "LCK Cup", team: "HLE", result: "champion" },
      { year: "2025", event: "First Stand", team: "HLE", result: "champion" },
      { year: "2024", event: "World Championship", team: "T1", result: "champion" },
      { year: "2024", event: "Esports World Cup", team: "T1", result: "champion" },
      { year: "2023", event: "World Championship", team: "T1", result: "champion" },
      { year: "2022", event: "LCK Spring", team: "T1", result: "champion" },
      { year: "2026", event: "Asian Games", team: "KOR", result: "gold" },
      { year: "2022", event: "Asian Games", team: "KOR", result: "gold" },
    ],
    awards: [
      { year: "2026", name: "MSI Finals MVP" },
      { year: "2025", name: "LCK Cup Finals MVP" },
      { year: "2023", name: "Worlds Finals MVP" },
      { year: "2022–2024", name: "LCK Top Laner of the Year" },
      { year: "2026", name: "All-LCK First Team" },
      { year: "2022–2023", name: "All-LCK First Team (Spring 2022, Summer 2022, Spring 2023)" },
    ],
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
    image: "/roster/kanavi.jpg",
    imagePosition: "70% 50%",
    detailImage: "/kanavi_detail.jpg",
    titles: [
      { year: "2026", event: "Mid-Season Invitational", team: "HLE", result: "champion" },
      { year: "2023", event: "Mid-Season Invitational", team: "JDG", result: "champion" },
      { year: "2023", event: "LPL Summer", team: "JDG", result: "champion" },
      { year: "2023", event: "LPL Spring", team: "JDG", result: "champion" },
      { year: "2022", event: "LPL Summer", team: "JDG", result: "champion" },
      { year: "2020", event: "LPL Spring", team: "JDG", result: "champion" },
      { year: "2022", event: "Asian Games", team: "KOR", result: "gold" },
    ],
    awards: [
      { year: "2026", name: "All-LCK First Team" },
      { year: "2023", name: "LPL Jungler of the Year" },
      { year: "2022", name: "LPL Jungler of the Year" },
      { year: "2022", name: "LPL Import Player of the Year" },
      { year: "2020", name: "LPL Spring Split MVP" },
    ],
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
    image: "/roster/zeka.jpg",
    imagePosition: "40% 50%",
    detailImage: "/zeka_detail.jpg",
    titles: [
      { year: "2026", event: "Mid-Season Invitational", team: "HLE", result: "champion" },
      { year: "2025", event: "LCK Cup", team: "HLE", result: "champion" },
      { year: "2025", event: "First Stand", team: "HLE", result: "champion" },
      { year: "2024", event: "LCK Summer", team: "HLE", result: "champion" },
      { year: "2022", event: "World Championship", team: "DRX", result: "champion" },
    ],
    awards: [
      { year: "2022", name: "LCK Player of the Year" },
      { year: "2026", name: "All-LCK Second Team" },
      { year: "2024", name: "All-LCK Second Team (Summer)" },
      { year: "2023–2024", name: "All-LCK Third Team (Summer 2023, Spring 2024)" },
    ],
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
    image: "/roster/gumayusi.jpg",
    imagePosition: "60% 50%",
    detailImage: "/guma_detail.jpg",
    titles: [
      { year: "2026", event: "Mid-Season Invitational", team: "HLE", result: "champion" },
      { year: "2025", event: "World Championship", team: "T1", result: "champion" },
      { year: "2024", event: "World Championship", team: "T1", result: "champion" },
      { year: "2024", event: "Esports World Cup", team: "T1", result: "champion" },
      { year: "2023", event: "World Championship", team: "T1", result: "champion" },
      { year: "2022", event: "LCK Spring", team: "T1", result: "champion" },
      { year: "2026", event: "Asian Games", team: "KOR", result: "gold" },
    ],
    awards: [
      { year: "2025", name: "Worlds Finals MVP" },
      { year: "2023–2025", name: "LCK Bot Laner of the Year" },
      { year: "2022–2023", name: "All-LCK First Team (Spring 2022, Spring 2023)" },
      { year: "2024–2026", name: "All-LCK Third Team (Spring 2024, 2025, 2026)" },
    ],
  },
  {
    id: "delight",
    role: "support",
    ign: "Delight",
    name: "Yoo Hwan-joong",
    bio: {
      vi: "Mở nhịp giao tranh, bảo kê đồng đội và thực hiện teamfight gọn gàng.",
      en: "Sets the pace for engages, peel, and clean teamfight execution.",
      ko: "교전 타이밍을 열고 아군을 보호하며 깔끔한 한타를 완성합니다.",
    },
    quote: "A clean engage is the start of a clean win.",
    image: "/roster/delight.jpg",
    imagePosition: "50% 50%",
    detailImage: "/delight_detail.jpg",
    titles: [
      { year: "2026", event: "Mid-Season Invitational", team: "HLE", result: "champion" },
      { year: "2025", event: "First Stand", team: "HLE", result: "champion" },
      { year: "2025", event: "LCK Cup", team: "HLE", result: "champion" },
      { year: "2024", event: "LCK Summer", team: "HLE", result: "champion" },
      { year: "2023", event: "LCK Summer", team: "Gen.G", result: "champion" },
      { year: "2023", event: "LCK Spring", team: "Gen.G", result: "champion" },
    ],
    awards: [
      { year: "2023", name: "LCK Assist King" },
      { year: "2023–2026", name: "All-LCK Second Team (Summer 2023, Summer 2024, 2026)" },
      { year: "2024–2025", name: "All-LCK Third Team (Spring 2024, 2025)" },
    ],
  },
];

export const ACHIEVEMENT_CARDS: AchievementCard[] = [
  {
    id: "lck-summer-2024",
    title: "LCK Summer 2024",
    year: "2024",
    badge: "LCK Champion",
    description: {
      vi: "Danh hiệu LCK đầu tiên trong lịch sử HLE, sau chung kết 3–2 trước Gen.G.",
      en: "HLE's first LCK title, won in a 3–2 final over Gen.G.",
      ko: "젠지를 3–2로 꺾고 차지한 한화생명e스포츠의 첫 LCK 우승입니다.",
    },
    image: "/achievements/lck-summer-2024.jpg",
  },
  {
    id: "lck-cup-2025",
    title: "LCK Cup 2025",
    year: "2025",
    badge: "LCK Champion",
    description: {
      vi: "Vô địch LCK Cup 2025 sau chung kết 3–2 trước Gen.G.",
      en: "LCK Cup 2025 champions after a 3–2 final against Gen.G.",
      ko: "젠지와의 결승에서 3–2로 승리해 2025 LCK컵을 우승했습니다.",
    },
    image: "/achievements/lck-cup-2025.jpg",
  },
  {
    id: "first-stand-2025",
    title: "First Stand 2025",
    year: "2025",
    badge: "International",
    description: {
      vi: "Chiếc cúp quốc tế đầu tiên của HLE, thắng Karmine Corp 3–1 ở chung kết.",
      en: "HLE's first international trophy, beating Karmine Corp 3–1 in the final.",
      ko: "카르민 코프를 3–1로 꺾고 들어 올린 한화생명e스포츠의 첫 국제 대회 우승입니다.",
    },
    image: "/achievements/first-stand-2025.jpg",
  },
  {
    id: "msi-2026",
    title: "MSI 2026",
    year: "2026",
    badge: "MSI Champion",
    description: {
      vi: "Vô địch MSI 2026 tại Daejeon, thắng Bilibili Gaming 3–2 trong chung kết.",
      en: "MSI 2026 champions in Daejeon, beating Bilibili Gaming 3–2 in the final.",
      ko: "대전에서 열린 MSI 2026 결승에서 빌리빌리 게이밍을 3–2로 꺾고 우승했습니다.",
    },
    image: "/achievements/msi-2026.jpg",
  },
];

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "ambient",
    label: "Orchard ambience",
    src: "/bgm-ambient.mp3",
  },
  {
    id: "celebration",
    label: "Thank-you tune",
    src: "/bgm-thanks.mp3",
  },
];

export const DEFAULT_LANGUAGE: Language = "vi";
