export interface PsychomatrixCell {
  num: number;
  label: string;
  count: number;
  symbols: string;
  meaning: string;
}

export interface CalculatedChart {
  birthDate: string;
  lifePathNumber: number;
  birthDayNumber: number;
  destinyNumber: number; // calculated as sum of single day + single month + single year reduced
  firstNum: number;
  secondNum: number;
  thirdNum: number;
  fourthNum: number;
  psychomatrix: {
    [key: number]: PsychomatrixCell;
  };
  matrixLines: {
    horizontal: {
      will: { label: string; value: number; max: number; desc: string }; // row 1: 1, 4, 7
      family: { label: string; value: number; max: number; desc: string }; // row 2: 2, 5, 8
      stability: { label: string; value: number; max: number; desc: string }; // row 3: 3, 6, 9
    };
    vertical: {
      selfEsteem: { label: string; value: number; max: number; desc: string }; // col 1: 1, 2, 3
      materialism: { label: string; value: number; max: number; desc: string }; // col 2: 4, 5, 6
      talentLine: { label: string; value: number; max: number; desc: string }; // col 3: 7, 8, 9
    };
    diagonal: {
      spirituality: { label: string; value: number; max: number; desc: string }; // diag 1-5-9
      temperament: { label: string; value: number; max: number; desc: string }; // diag 3-5-7
    };
  };
}

export interface SavedProfile {
  id: string;
  name: string;
  birthDate: string;
  createdAt: number;
}

export interface PredictionItem {
  id: string;
  type: "coin" | "compatibility";
  title: string;
  details: string;
  createdAt: number;
}

export interface UserState {
  crystals: number;
  savedProfiles: SavedProfile[];
  unlockedFeatures: string[]; // List of unlocked features, e.g., "compatibility-XYZ", "matrix-deep-dive"
  dailyClaimedAt: string | null; // YYYY-MM-DD
}

export interface NumerologyMeaning {
  title: string;
  vibes: string[];
  description: string;
  lessons: string;
  career: string;
  crystalsCost?: number;
}
