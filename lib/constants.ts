export type DivinationResult = 'SHENG' | 'XIAO' | 'YIN';

export interface Complaint {
  id: string;
  text: string;
  timestamp: number;
  rotation: number;
  status?: 'SHREDDED' | 'BURNT' | 'PENDING';
}

export const RESULTS = {
  QUIT: {
    title: "辞职申请书",
    subtitle: "老子不干了！",
    stamp: "准予离职",
    color: "bg-retro-yellow text-retro-ink",
    divinationText: "圣杯：天意如此，神仙都劝你快跑。"
  },
  STAY: {
    title: "再忍五天暴击卡",
    subtitle: "为了五斗米折腰",
    stamp: "继续搬砖",
    color: "bg-retro-yellow text-retro-ink",
    divinationText: "阴杯：神仙生气了，工资卡余额提醒你冷静。"
  },
  MAYBE: {
    title: "赛博摸鱼许可证",
    subtitle: "带薪如厕，精神离职",
    stamp: "建议摸鱼",
    color: "bg-white text-retro-ink",
    divinationText: "笑杯：神仙笑而不语，可能觉得你还没穷够。"
  }
};

export const ZHA_XIN_REPLIES = [
  "老板画的饼太大，胃动力不足，建议物理隔离。",
  "月薪 3000？这哪是上班，这是在做慈善，建议给自己颁发诺贝尔和平奖。",
  "同事太奇葩？那是他在帮你磨练心性，离修仙只差一个辞职信。",
  "别问了，你的福报在后面，大概在 65 岁退休那天。"
];

