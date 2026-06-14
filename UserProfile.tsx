import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  User,
  Sparkles,
  Lock,
  Compass,
  FileText,
  Trash2,
  Bookmark,
  Gem,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { calculateNumerology } from "../utils/numerologyCalculator";
import { LIFE_PATH_DICTIONARY } from "../data/numerologyDb";
import { SavedProfile, CalculatedChart } from "../types";

interface NumerologyDashboardProps {
  crystals: number;
  unlockedFeatures: string[];
  onUnlockFeature: (id: string, cost: number) => boolean;
  savedProfiles: SavedProfile[];
  onSaveProfile: (name: string, date: string) => void;
  onDeleteProfile: (id: string) => void;
  activeName: string;
  setActiveName: (val: string) => void;
  activeBirthDate: string;
  setActiveBirthDate: (val: string) => void;
  isLoggedIn: boolean;
  onGoToProfile: () => void;
}

export default function NumerologyDashboard({
  crystals,
  unlockedFeatures,
  onUnlockFeature,
  savedProfiles,
  onSaveProfile,
  onDeleteProfile,
  activeName,
  setActiveName,
  activeBirthDate,
  setActiveBirthDate,
  isLoggedIn,
  onGoToProfile,
}: NumerologyDashboardProps) {
  // Input form state
  const [profileNameInput, setProfileNameInput] = useState("");

  // Calculation target
  const [currentChart, setCurrentChart] = useState<CalculatedChart | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(1); // default selection: Cell 1 Character
  const [selectedLineKey, setSelectedLineKey] = useState<string | null>(null);

  // Calculation Animation states
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingSteps = [
    "Зчитування астральних вібрацій...",
    "Аналіз тригонів долі...",
    "Побудова психоматриці...",
    "Синхронізація кармічних потоків..."
  ];

  // No auto-calculate effect on mount or change. The user must manually trigger using "Розрахувати карту долі".

  const handleCalculate = (shouldScroll = false) => {
    setIsCalculating(true);
    setLoadingTextIndex(0);

    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 280);

    if (shouldScroll) {
      setTimeout(() => {
        document.getElementById("right-chart-column")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }

    const timer = setTimeout(() => {
      try {
        const chart = calculateNumerology(activeBirthDate);
        setCurrentChart(chart);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCalculating(false);
        clearInterval(interval);
      }
    }, 1100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  };

  const handleSaveCurrent = () => {
    const saveName = activeName.trim() || `Розрахунок за ${activeBirthDate}`;
    onSaveProfile(saveName, activeBirthDate);
  };

  const handleLoadProfile = (prof: SavedProfile) => {
    setActiveName(prof.name);
    setActiveBirthDate(prof.birthDate);
    // Explicitly recalculate when they load a profile
    setTimeout(() => {
      handleCalculate(true);
    }, 100);
  };

  // Check if a specific cell is locked for the current profile date
  // Guest results are heavily locked (ALL cells locked except cell 1)
  const isCellLocked = (cellNum: number): boolean => {
    if (!isLoggedIn) {
      return cellNum !== 1; // lock everything except cell 1 for guests
    }
    const lockableCells = [5, 7, 8];
    if (!lockableCells.includes(cellNum)) return false;
    const featureId = `cell-${activeBirthDate}-${cellNum}`;
    return !unlockedFeatures.includes(featureId);
  };

  // Check if a line breakdown is locked for the current profile date
  // Guest results lock all lines
  const isLineLocked = (lineKey: string): boolean => {
    if (!isLoggedIn) {
      return true; // lock all lines for guests
    }
    // Only lock complex vectors (spiritual, temperament, talentLine)
    const lockableLines = ["spirituality", "temperament", "talentLine"];
    if (!lockableLines.includes(lineKey)) return false;
    const featureId = `line-${activeBirthDate}-${lineKey}`;
    return !unlockedFeatures.includes(featureId);
  };

  const handleUnlockCell = (cellNum: number) => {
    if (!isLoggedIn) {
      onGoToProfile();
      return;
    }
    const featureId = `cell-${activeBirthDate}-${cellNum}`;
    onUnlockFeature(featureId, 10);
  };

  const handleUnlockLine = (lineKey: string) => {
    if (!isLoggedIn) {
      onGoToProfile();
      return;
    }
    const featureId = `line-${activeBirthDate}-${lineKey}`;
    onUnlockFeature(featureId, 15);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Input form */}
      <div className="lg:col-span-4">
        {/* Form panel */}
        <div id="calculator-input-card" className="p-6 rounded-3xl glass border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="font-display text-lg font-light tracking-widest uppercase text-[#e2e2e7] mb-4 flex items-center gap-2">
            <div className="crystal-shape mr-1.5" style={{ transform: "scale(0.85)" }} />
            <span>Параметри Карти</span>
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1.5">Ваше Ім'я (необов'язково)</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-purple-400/40" />
                <input
                  type="text"
                  id="user-name-input"
                  placeholder="Введіть ім'я..."
                  value={activeName}
                  onChange={(e) => setActiveName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-[#e2e2e7] placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all font-display"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1.5">Дата Народження</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-purple-400/40" />
                <input
                  type="date"
                  id="user-date-input"
                  value={activeBirthDate}
                  onChange={(e) => setActiveBirthDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all cursor-pointer font-display"
                />
              </div>
              <button
                id="recalculate-cosmic-btn"
                onClick={() => handleCalculate(true)}
                className="w-full mt-3 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-200 text-[10px] font-display tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span>Розрахувати Карту ✧</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Full chart and matrix */}
      <div id="right-chart-column" className="lg:col-span-8 flex flex-col gap-6 scroll-mt-6">
        <AnimatePresence mode="wait">
          {isCalculating ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass rounded-[40px] p-8 sm:p-12 min-h-[480px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl"
            >
              {/* Spinning Sacred geometry container */}
              <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                {/* Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-purple-500/30"
                />
                {/* Middle Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-purple-300/10"
                />
                {/* Inner Ring with dots */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute inset-8 rounded-full border border-purple-400/20 flex items-center justify-center animate-pulse"
                />
                {/* Center Glowing Crystal */}
                <motion.div
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <div className="crystal-shape crystal-glow scale-[2]" />
                </motion.div>

                {/* Magical particles inside container */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-10, 10, -10],
                      x: [-10, 10, -10],
                      opacity: [0.2, 0.8, 0.2]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + i,
                      delay: i * 0.3
                    }}
                    className="absolute w-1.5 h-1.5 bg-indigo-400/50 rounded-full blur-[1px]"
                    style={{
                      top: `${15 + i * 15}%`,
                      left: `${15 + ((i * 123) % 70)}%`
                    }}
                  />
                ))}
              </div>

              {/* Loader Header and subtitle */}
              <h3 className="font-display text-2xl font-light text-[#e2e2e7] tracking-widest uppercase mb-2">
                AETHERIS МАТРИЦЯ
              </h3>
              <div className="h-6 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={loadingTextIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-purple-300/80 font-mono tracking-widest"
                  >
                    {loadingSteps[loadingTextIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress Bar Container */}
              <div className="w-64 h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 rounded-full"
                />
              </div>
            </motion.div>
          ) : !currentChart ? (
            <motion.div
              key="intro-placeholder"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[40px] p-8 sm:p-12 min-h-[440px] flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none" />
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 shadow-xl shadow-purple-950/20"
              >
                <Compass className="w-8 h-8 text-purple-400 animate-pulse" />
              </motion.div>
              
              <h3 className="font-display text-lg sm:text-xl font-light tracking-widest text-[#e2e2e7] uppercase mb-3">
                АСТРАЛЬНЕ КРЕСЛЕННЯ ДОЛІ
              </h3>
              <p className="text-xs text-purple-200/60 max-w-md mx-auto leading-relaxed font-display font-light mb-8">
                Введіть ваше священне Ім'я та Дату народження ліворуч, після чого запустіть небесний лічильник, натиснувши кнопку <strong className="text-purple-300 font-medium">"Розрахувати карту долі"</strong>. Кристал обчислить ваші життєві тригони, психоматрицю Піфагора та розкриє прихований потенціал душі!
              </p>

              <button
                onClick={() => handleCalculate(true)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/35 hover:to-indigo-500/35 border border-purple-400/30 text-purple-200 font-display text-[10px] font-semibold uppercase tracking-widest cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-950/30"
              >
                Розрахувати карту долі ✧
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* 1. Life Path (Число життєвого шляху) display */}
              {(() => {
                const lpDef = LIFE_PATH_DICTIONARY[currentChart.lifePathNumber];
                return (
                  lpDef && (
                    <div id="life-path-banner" className="glass rounded-[40px] p-8 sm:p-12 relative overflow-hidden flex flex-col min-h-[380px] hover:border-white/10 transition-all shadow-xl">
                      {/* Giant Number in the absolute background */}
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <h2 className="font-display text-[200px] leading-none select-none text-purple-400">{currentChart.lifePathNumber}</h2>
                      </div>

                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex flex-wrap items-baseline gap-3.5 mb-2.5">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-purple-400">Число Життєвого Шляху</span>
                          <span className="text-xs text-white/40 font-mono tracking-widest">
                            Нар. {activeBirthDate.split("-").reverse().join(".")}
                          </span>
                        </div>

                        <h3 className="font-display text-4xl sm:text-5xl font-light tracking-wide text-white mb-2">
                          {lpDef.title.split(" - ")[0]} <span className="text-purple-400/85 font-semibold font-sans">({currentChart.lifePathNumber})</span>
                        </h3>
                        <p className="font-display italic text-lg sm:text-2xl text-purple-200/90 mb-6 font-light">
                          &ldquo;{lpDef.vibes.join(" ✧ ")}&rdquo;
                        </p>
                        
                        <div className="divider mb-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                          <section>
                            <h4 className="text-[10px] uppercase tracking-widest text-purple-300/60 mb-3.5">Характеристика енергії особистості</h4>
                            <p className="text-xs sm:text-sm leading-relaxed text-[#e2e2e7]/80">
                              {lpDef.description}
                            </p>
                          </section>
                          <section>
                            <h4 className="text-[10px] uppercase tracking-widest text-[#9d4edd] mb-3.5 font-sans">Головні місії та уроки</h4>
                            <ul className="text-xs sm:text-sm space-y-3.5 text-[#e2e2e7]/90 list-none p-0">
                              {lpDef.lessons.split(". ").filter(Boolean).map((lessonStr, index) => (
                                <li key={index} className="flex gap-2.5 leading-relaxed text-xs sm:text-sm">
                                  <span className="text-purple-400">✦</span>
                                  <span>{lessonStr.trim().replace(/\.$/, "")}.</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        </div>

                        {/* Save Result to Profile Button */}
                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                          <div className="text-xs text-white/50 font-display">
                            Клієнт: <span className="text-purple-300 font-bold">{activeName || "Гість"}</span> · Народився: <span className="text-purple-300 font-bold">{activeBirthDate.split("-").reverse().join(".")}</span>
                          </div>
                          {isLoggedIn ? (
                            <button
                              id="save-blueprint-to-vault"
                              onClick={() => onSaveProfile(activeName || "Мій Розрахунок", activeBirthDate)}
                              className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/35 hover:bg-purple-500/25 text-purple-200 text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider shadow-lg shadow-purple-950/20"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Зберегти Креслення у Сейф ✧</span>
                            </button>
                          ) : (
                            <button
                              id="save-blueprint-locked"
                              onClick={onGoToProfile}
                              className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-200 text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider opacity-85"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Зберегти карту (Потрібно Увійти) 🗝️</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                );
              })()}

              {/* 2. Pythagorean Matrix & Cell Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Visual Matrix Grid (LEFT 5 cols on md) */}
                <div className="md:col-span-6 flex flex-col gap-4">
                  <div className="p-6 rounded-3xl glass border-white/5 relative">
                    <h3 className="font-display text-sm font-light uppercase tracking-[0.2em] text-purple-300 mb-4 flex items-center justify-between">
                      <span>Психоматриця Піфагора</span>
                      <span className="text-[10px] text-white/40 font-mono select-none">3 x 3 Матриця</span>
                    </h3>

                    {/* Additional Sub calculation numbers */}
                    <div className="mb-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-around text-center gap-2 font-mono">
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider leading-none">Робочий Ряд</p>
                        <p className="text-sm font-bold text-purple-300 mt-1.5 tracking-widest">
                          {currentChart.firstNum} · {currentChart.secondNum} · {currentChart.thirdNum} · {currentChart.fourthNum}
                        </p>
                      </div>
                    </div>

                    {/* The 3x3 Grid */}
                    <div id="pythagorean-grid-3x3" className="grid grid-cols-3 gap-2 aspect-square">
                      {[
                        // Row 1
                        { num: 1, name: "Характер" },
                        { num: 4, name: "Здоров'я" },
                        { num: 7, name: "Удача" },
                        // Row 2
                        { num: 2, name: "Енергія" },
                        { num: 5, name: "Логіка" },
                        { num: 8, name: "Обов'язок" },
                        // Row 3
                        { num: 3, name: "Інтерес" },
                        { num: 6, name: "Праця" },
                        { num: 9, name: "Розум" },
                      ].map((cellInfo) => {
                        const cell = currentChart.psychomatrix[cellInfo.num];
                        const isLocked = isCellLocked(cellInfo.num);
                        const isSelected = selectedCell === cellInfo.num;

                        return (
                          <motion.button
                            key={cellInfo.num}
                            id={`grid-cell-${cellInfo.num}`}
                            onClick={() => {
                              setSelectedCell(cellInfo.num);
                              setSelectedLineKey(null);
                            }}
                            whileHover={{ scale: isSelected ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 rounded-2xl border flex flex-col justify-between text-left relative transition-all duration-300 overflow-hidden cursor-pointer ${
                              isSelected
                                ? "bg-white/[0.08] border-purple-400/40 crystal-glow z-10"
                                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                            }`}
                          >
                            <div className="flex items-start justify-between w-full">
                              <span className="text-[10px] font-sans text-white/60 leading-tight">
                                {cellInfo.name}
                              </span>
                              <span className="text-[9px] font-mono text-purple-300/60 font-semibold bg-white/5 px-1 rounded">
                                {cellInfo.num}
                              </span>
                            </div>

                            <div className="my-auto self-center text-center">
                              {isLocked ? (
                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: [0.95, 1.05, 0.95] }}
                                  transition={{ repeat: Infinity, duration: 2.5 }}
                                  className="text-amber-400 flex flex-col items-center gap-0.5"
                                >
                                  <Lock className="w-4 h-4 opacity-75" />
                                  <span className="text-[8px] font-semibold tracking-wider uppercase opacity-80">Герметик</span>
                                </motion.div>
                              ) : (
                                <span className={`text-base font-bold font-mono tracking-widest ${
                                  cell.count > 0 ? "text-purple-100" : "text-white/15"
                                }`}>
                                  {cell.symbols || "—"}
                                </span>
                              )}
                            </div>

                            <div className="w-full flex justify-end">
                              {isLocked ? (
                                <span className="text-[8px] text-amber-300/80 font-mono font-semibold">
                                  10 💎
                                </span>
                              ) : (
                                <span className="text-[8px] text-white/30 font-mono">
                                  К-сть: {cell.count}
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Selected Cell Description (RIGHT 6 cols on md) */}
                <div className="md:col-span-6 h-full flex flex-col">
                  {selectedCell && (
                    <div id="cell-detail-pane" className="p-6 rounded-3xl glass border-white/5 h-full flex flex-col relative min-h-64 sm:min-h-auto justify-between">
                      {(() => {
                        const cell = currentChart.psychomatrix[selectedCell];
                        const isLocked = isCellLocked(selectedCell);

                        return (
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
                              <div>
                                <p className="text-[9px] text-purple-400 font-mono uppercase tracking-[0.2em]">Значення Комірки {selectedCell}</p>
                                <h4 className="font-display text-lg font-light text-white mt-0.5">{cell.label}</h4>
                              </div>
                              <span className="text-lg font-semibold font-mono text-purple-300 bg-white/5 border border-white/10 w-9 h-9 rounded-xl flex items-center justify-center">
                                {selectedCell}
                              </span>
                            </div>

                            {isLocked ? (
                              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                                <div className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-amber-400 mb-3.5">
                                  <Lock className="w-5 h-5" />
                                </div>
                                <h5 className="font-display text-sm font-normal text-amber-200 uppercase tracking-widest">Таємницю Заблоковано</h5>
                                <p className="text-xs text-white/60 max-w-xs mt-2 leading-relaxed font-light">
                                  Ця комірка ({cell.label}) розкриває приховані уроки та містичні задатки вашої душі за датою {activeBirthDate.split("-").reverse().join(".")}.
                                </p>
                                <motion.button
                                  id="unlock-cell-button"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleUnlockCell(selectedCell)}
                                  className={`mt-5 px-5 py-2.5 rounded-xl font-semibold text-[10px] tracking-widest uppercase flex items-center gap-2 cursor-pointer transition-all ${
                                    isLoggedIn 
                                      ? "bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/35 text-purple-100" 
                                      : "bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/35 text-amber-200 shadow-lg shadow-amber-950/20"
                                  }`}
                                >
                                  {isLoggedIn ? (
                                    <>
                                      <div className="crystal-shape scale-75" />
                                      <span>Розблокувати за 10 💎</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3.5 h-3.5 animate-pulse" />
                                      <span>Увійти для розблокування 🗝️</span>
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            ) : (
                              <div className="flex-1 flex flex-col justify-between h-full">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-purple-300 font-semibold bg-white/5 px-2.5 py-1 border border-white/5 rounded-lg">
                                      Енергетичний код: {cell.symbols || "відсутній"}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-[#e2e2e7]/80 leading-relaxed italic font-display">
                                    &ldquo;{cell.meaning}&rdquo;
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-white/5 text-[10px] text-white/30 font-mono mt-6">
                                  * Кількість цифр показує вроджену силу відповідної якості. Щоб змінити значення, ви можете ввести іншу дату у панелі параметрів.
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Personality Vectors / Lines Section (Bento grid visualizers) */}
              <div id="personality-vectors-section" className="p-6 rounded-3xl glass border-white/5 shadow-xl">
                <h3 className="font-display text-sm font-light uppercase tracking-[0.2em] text-[#e2e2e7] mb-3 flex items-center gap-2">
                  <div className="crystal-shape shrink-0" style={{ transform: "scale(0.8)" }} />
                  <span>Космічні Вектори Психоматриці</span>
                </h3>
                <p className="text-xs text-white/50 mb-6 leading-relaxed font-light">
                  Поєднання цифр у рядах, стовпцях та діагоналях Квадрата Піфагора формує особливі енергетичні лінії, які показують життєві прагнення користувача. Оберіть лінію для детального аналізу.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left row: list of vectors */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {[
                      { key: "will", category: "horizontal", label: "Цілеспрямованість", icon: "Рядок 1" },
                      { key: "family", category: "horizontal", label: "Сімейність", icon: "Рядок 2" },
                      { key: "stability", category: "horizontal", label: "Стабільність", icon: "Рядок 3" },
                      { key: "selfEsteem", category: "vertical", label: "Самооцінка", icon: "Стовп. 1" },
                      { key: "materialism", category: "vertical", label: "Побут і Матеріальність", icon: "Стовп. 2" },
                      { key: "talentLine", category: "vertical", label: "Потенціал Таланту", icon: "Стовп. 3" },
                      { key: "spirituality", category: "diagonal", label: "Духовний світ", icon: "Діаг. 1-5-9" },
                      { key: "temperament", category: "diagonal", label: "Темперамент", icon: "Діаг. 3-5-7" },
                    ].map((vector) => {
                      const lineObj = (
                        currentChart.matrixLines as any
                      )[vector.category][vector.key];
                      const isLocked = isLineLocked(vector.key);
                      const isSelected = selectedLineKey === vector.key;

                      return (
                        <button
                          key={vector.key}
                          id={`vector-item-${vector.key}`}
                          onClick={() => {
                            setSelectedLineKey(vector.key);
                            setSelectedCell(null);
                          }}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-white/[0.08] border-purple-400/30 crystal-glow"
                              : "bg-white/[0.02] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-white">
                                {vector.label}
                              </span>
                              <span className="text-[10px] font-mono text-purple-300/60 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                {vector.icon}
                              </span>
                            </div>

                            {/* Custom mini progress bar */}
                            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden relative">
                              <div
                                style={{ width: `${(lineObj.value / lineObj.max) * 100}%` }}
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            {isLocked ? (
                              <div className="text-amber-400 flex items-center gap-1 bg-white/5 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                <Lock className="w-3 h-3" />
                                <span>15 💎</span>
                              </div>
                            ) : (
                              <span className="text-xs font-mono font-bold text-purple-300">
                                {lineObj.value} / {lineObj.max}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right row: Selected vector detailed text */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 min-h-48 flex flex-col justify-between">
                    {selectedLineKey ? (
                      (() => {
                        // Find selected line object details
                        const allVectors = [
                          { key: "will", category: "horizontal", label: "Цілеспрямованість" },
                          { key: "family", category: "horizontal", label: "Сімейність" },
                          { key: "stability", category: "horizontal", label: "Стабільність" },
                          { key: "selfEsteem", category: "vertical", label: "Самооцінка" },
                          { key: "materialism", category: "vertical", label: "Побут і Матеріальність" },
                          { key: "talentLine", category: "vertical", label: "Потенціал Таланту" },
                          { key: "spirituality", category: "diagonal", label: "Духовній світ" },
                          { key: "temperament", category: "diagonal", label: "Темперамент" },
                        ];
                        const foundVec = allVectors.find((v) => v.key === selectedLineKey)!;
                        const lineObj = (
                          currentChart.matrixLines as any
                        )[foundVec.category][foundVec.key];
                        const isLocked = isLineLocked(selectedLineKey);

                        return (
                          <div className="flex-1 flex flex-col justify-between h-full">
                            <div>
                              <div className="pb-2 border-b border-white/5 mb-3 flex justify-between items-center">
                                <h4 className="font-display text-sm font-light text-white uppercase tracking-widest">
                                  {foundVec.label}
                                </h4>
                                <span className="text-xs font-mono text-purple-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                  Разом: {lineObj.value}
                                </span>
                              </div>

                              {isLocked ? (
                                <div className="py-6 flex flex-col items-center justify-center text-center">
                                  <Lock className="w-5 h-5 text-amber-400 mb-2" />
                                  <h5 className="font-display text-xs font-normal text-amber-200 uppercase tracking-wider">Глибокий розбір ліній заблоковано</h5>
                                  <p className="text-xs text-white/50 max-w-xs mt-1">
                                    {isLoggedIn 
                                      ? "Отримайте детальну інтерпретацію цього кармічного вектора за кристали." 
                                      : "Авторизуйтесь в системі для доступу до розширеної інтерпретації ліній."}
                                  </p>
                                  <button
                                    id="unlock-line-button"
                                    onClick={() => handleUnlockLine(selectedLineKey)}
                                    className={`mt-3.5 px-3 py-1.5 rounded-lg font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all hover:scale-105 ${
                                      isLoggedIn 
                                        ? "bg-purple-500/20 border border-purple-500/40 text-purple-100" 
                                        : "bg-amber-500/20 border border-amber-500/40 text-amber-200"
                                    }`}
                                  >
                                    {isLoggedIn ? (
                                      <>
                                        <div className="crystal-shape scale-75" />
                                        <span>Розблокувати за 15 💎</span>
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="w-3.5 h-3.5 animate-pulse" />
                                        <span>Увійти для розблокування 🗝️</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic font-display">
                                  &ldquo;{lineObj.desc}&rdquo;
                                </p>
                              )}
                            </div>

                            <p className="text-[10px] text-white/40 mt-4 leading-normal font-mono border-t border-white/5 pt-2">
                              * Сума цифр на лінії вказує на внутрішнє спрямування прагнень душі. Чим більший бал (макс 6), тим яскравіше проявляється вібрація.
                            </p>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-white/30 p-4">
                        <BookOpen className="w-8 h-8 opacity-30 mb-2" />
                        <p className="text-xs font-display italic font-light">Оберіть будь-який вектор зліва, щоб переглянути опис його сили.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration/Login CTA Banner */}
              {!isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 sm:p-8 rounded-[32px] border border-purple-500/30 bg-purple-950/20 relative overflow-hidden mt-8 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="space-y-2 max-w-xl relative z-10">
                    <h4 className="font-display text-base sm:text-lg font-normal text-purple-200 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span>Розкрийте Повний Астральний Потенціал</span>
                    </h4>
                    <p className="text-xs text-white/75 leading-relaxed font-display">
                      Створіть свій священний профіль та увійдіть в систему, щоб розблокувати <strong>Кармічну Сумісність</strong>, заглянути в таємничу <strong>Монетку Долі</strong>, освоїти таємниці <strong>Оселі Кристалів</strong> та отримати свій щоденний баланс сили. Сейф також збереже ваші розрахунки назавжди!
                    </p>
                  </div>
                  <button
                    onClick={onGoToProfile}
                    className="shrink-0 w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-display text-xs font-semibold uppercase tracking-widest transition-all hover:scale-[1.03] cursor-pointer shadow-lg shadow-purple-950/40 relative z-10"
                  >
                    Зареєструватися або Увійти ✧
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
