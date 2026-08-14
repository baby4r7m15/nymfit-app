import { BlockType } from "@/lib/types";

export const ARTEMIS_TEMPLATE: { type: BlockType; content: Record<string, any> }[] = [
  {
    type: "hero",
    content: {
      title: "//_ARTEMIS.EXE",
      imageUrl: "",
      lockedLabel: "LOCKED",
    },
  },
  {
    type: "about",
    content: {
      title: "//_ABOUT_ME",
      name: "ARTEMIS.EXE",
      role: "Guardian Process",
      bio: [
        "I watch over the things that matter.",
        "I don't always speak.",
        "I don't need to.",
        "If you're here... you're safe.",
      ],
      stats: [
        { label: "ROLE:", value: "Guardian" },
        { label: "SPECIES:", value: "Protogen Rabbit" },
        { label: "HEIGHT:", value: "5'4\" (head)" },
        { label: "STATUS:", value: "Protecting" },
        { label: "PRONOUNS:", value: "any / all" },
        { label: "CORE:", value: "Protection, Loyalty, Comfort" },
      ],
      imageUrl: "",
    },
  },
  {
    type: "quote",
    content: {
      title: "//_QUOTE.LOG",
      lines: ['"You don\'t have to be strong here.', 'You just have to exist."'],
    },
  },
  {
    type: "status",
    content: {
      title: "//_STATUS",
      state: "STABLE",
      rows: [
        { label: "heart rate:", value: "calm" },
        { label: "energy:", value: "medium" },
        { label: "threat level:", value: "none" },
      ],
      footer: "you are safe here.",
    },
  },
  {
    type: "taglist",
    content: {
      title: "//_LIKES",
      style: "likes",
      items: ["rain", "soft things", "night drives", "neon lights", "head pats", "loyalty", "quiet company", "you"],
    },
  },
  {
    type: "taglist",
    content: {
      title: "//_DISLIKES",
      style: "dislikes",
      items: ["loud places", "being touched without consent", "lies", "hurting others", "crowds", "being ignored", "heat"],
    },
  },
  {
    type: "personality",
    content: {
      title: "//_PERSONALITY",
      axes: ["protective", "loyal", "calm", "chaotic", "shy", "intense"],
      values: [95, 90, 55, 30, 35, 55],
    },
  },
  {
    type: "memories",
    content: {
      title: "//_MEMORIES",
      items: [
        { file: "2022_07_15.exe", label: "the beginning" },
        { file: "2022_09_03.exe", label: "first connection" },
        { file: "2023_01_21.exe", label: "rainy night" },
        { file: "2023_06_11.exe", label: "promise made" },
      ],
      footer: "...more memories locked",
    },
  },
  {
    type: "playlist",
    content: {
      title: "//_PLAYLIST.EXE",
      artUrl: "",
      name: "midnight guardian",
      status: "now playing",
      track: "sleep token",
      album: "rain",
      currentTime: "1:42",
      duration: "4:21",
      progress: 40,
    },
  },
  {
    type: "friends",
    content: {
      title: "//_FRIENDS.NET",
      items: [
        { name: "ASH.exe", tag: "MIDNIGHT", imageUrl: "" },
        { name: "LUMI.exe", tag: "MIDDAY", imageUrl: "" },
        { name: "VEXX.exe", tag: "CHAOS", imageUrl: "" },
        { name: "YOU.exe", tag: "TRUSTED", imageUrl: "" },
      ],
    },
  },
  {
    type: "sysinfo",
    content: {
      title: "//_SYSTEM_INFO",
      lines: ["midnight.exe v1.3.7", "guardian build", "", "uptime: \u221e", "connections: 1", "status: all systems normal"],
      imageUrl: "",
    },
  },
];
