export interface Prayer {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  flameColor: string;
}

export const STATS = {
  total: 12405,
  today: 8230,
  week: 54112,
};

export const SAMPLE_PRAYERS: Prayer[] = [
  {
    id: "1",
    name: "Minh Tuấn",
    content: "HLE vô địch! Zeus gánh team lên đỉnh thế giới! 🏆",
    createdAt: new Date(Date.now() - 1000 * 60 * 3),
    flameColor: "#f27220",
  },
  {
    id: "2",
    name: "Fan HLE VN",
    content: "Chúc các anh thi đấu thật tốt trận tới. Peanut combo cực mạnh!",
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
    flameColor: "#ff8c42",
  },
  {
    id: "3",
    name: "Zeka Fan",
    content: "Zeka mid diff! HLE sẽ mang cup về nhà! 🔥",
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
    flameColor: "#f27220",
  },
  {
    id: "4",
    name: "LCK Enthusiast",
    content: "Beyond the Challenge! Trust, Teamwork, Innovation. HLE Fighting!",
    createdAt: new Date(Date.now() - 1000 * 60 * 47),
    flameColor: "#b8babd",
  },
  {
    id: "5",
    name: "Viper Supporter",
    content: "Viper ADC huyền thoại! Praying for the championship! 🏆🔥",
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
    flameColor: "#f27220",
  },
];