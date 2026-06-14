import { motion, AnimatePresence } from "motion/react";
import { Gem, Sparkles, Calendar, Heart, HelpCircle, Award, User, Lock } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  crystals: number;
  onClaimDaily: () => void;
  dailyClaimable: boolean;
  onOpenStore: () => void;
  isLoggedIn: boolean;
}

export default function Header({
  currentTab,
  setCurrentTab,
  crystals,
  onClaimDaily,
  dailyClaimable,
  onOpenStore,
  isLoggedIn,
}: HeaderProps) {
  return (
    <>
      {/* Primary Header */}
      <header className="relative w-full border-b border-white/5 bg-[#08080a]/80 backdrop-blur-lg px-3 py-3 sm:px-6 sm:py-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-3 md:gap-4 lg:gap-6">
          {/* Logo and App Title */}
          <div className="flex items-center gap-2 sm:gap-3 select-none shrink-0">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex items-center justify-center shrink-0"
            >
              <div className="crystal-shape crystal-glow scale-75 sm:scale-100" />
            </motion.div>
            <div className="flex flex-col items-start">
              <h1 className="font-display text-base sm:text-lg lg:text-2xl font-light tracking-widest uppercase text-[#e2e2e7] leading-none">
                AETHERIS <span className="hidden lg:inline text-purple-400/80 font-normal normal-case italic text-xs tracking-wide ml-1">Кристал Долі</span>
              </h1>
              <p className="text-[7px] sm:text-[9px] text-purple-300/50 font-mono tracking-[0.15em] sm:tracking-[0.25em] uppercase mt-1 leading-none">
                Священні Вібрації
              </p>
            </div>
          </div>

          {/* Desktop Tab Selection (hidden on mobile, optimized for tight widths) */}
          <div className="hidden md:flex items-center gap-1 p-0.5 rounded-full glass border-white/5 max-w-full overflow-x-auto">
            {[
              { id: "chart", label: "Карта Життя", icon: Calendar },
              { id: "compatibility", label: "Сумісність", icon: Heart, protected: true },
              { id: "coin", label: "Монетка", icon: HelpCircle, protected: true },
              { id: "sanctuary", label: "Кристали", icon: Award, protected: true },
              { id: "profile", label: "Профіль", icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              const isLocked = tab.protected && !isLoggedIn;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] lg:text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0 ${
                    isActive ? "text-[#e2e2e7]" : "text-purple-300/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-full -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isLocked ? (
                    <Lock className="w-3 h-3 text-amber-500/80 z-10" />
                  ) : (
                    <Icon className={`w-3 h-3 lg:w-3.5 lg:h-3.5 z-10 ${isActive ? "text-purple-300 animate-pulse" : "text-purple-400/40"}`} />
                  )}
                  <span className="z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Header Area */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 shrink-0">
                {/* Daily Gift Button */}
                <AnimatePresence mode="popLayout">
                  {dailyClaimable && (
                    <motion.button
                      id="claim-daily-btn"
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClaimDaily}
                      className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 text-purple-200 transition-all uppercase tracking-wider cursor-pointer h-8 sm:h-9 shrink-0"
                    >
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>+20 💎</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Redesigned Pill with click store triggers */}
                <motion.div
                  id="crystal-pill"
                  animate={{ scale: [1, 1.02, 1] }}
                  key={crystals}
                  transition={{ duration: 0.4 }}
                  onClick={onOpenStore}
                  className="glass px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 hover:border-purple-500/30 transition-all h-8 sm:h-9 cursor-pointer select-none relative group bg-white/[0.01] shrink-0"
                  title="Поповнити астральну силу"
                >
                  <div className="flex items-center gap-1 pl-0.5">
                    <div className="crystal-shape crystal-glow scale-[0.5] sm:scale-75 shrink-0" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[6px] sm:text-[7px] uppercase tracking-tighter opacity-40">Сила</span>
                      <span className="text-[9px] sm:text-xs font-semibold text-purple-300 mt-0.5">{crystals.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Plus (+) indicator indicator Inside the capsule */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500/20 group-hover:bg-purple-500/40 text-purple-200 flex items-center justify-center text-[9px] sm:text-[11px] font-bold transition-all border border-purple-500/30 shrink-0">
                    +
                  </div>
                </motion.div>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab("profile")}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px] font-bold uppercase tracking-wider hover:bg-purple-500/40 cursor-pointer transition-all flex items-center gap-1 shadow-md shadow-purple-950/20"
              >
                <User className="w-3 h-3" />
                <span>Увійти</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Bottom Tab Dock for Mobile (md:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black via-black/95 to-transparent md:hidden">
        <div className="relative flex items-center justify-around py-1.5 px-2 rounded-2xl bg-[#0e0e12]/95 border border-white/5 backdrop-blur-xl shadow-2xl max-w-md mx-auto">
          {[
            { id: "chart", label: "Карта", icon: Calendar },
            { id: "compatibility", label: "Сумісність", icon: Heart, protected: true },
            { id: "coin", label: "Доля", icon: HelpCircle, protected: true },
            { id: "sanctuary", label: "Сила", icon: Award, protected: true },
            { id: "profile", label: "Профіль", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const isLocked = tab.protected && !isLoggedIn;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-300 cursor-pointer select-none min-w-[55px] ${
                  isActive ? "text-purple-300" : "text-white/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTabGlow"
                    className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-xl -z-0"
                  />
                )}
                {isLocked ? (
                  <Lock className="w-4 h-4 text-amber-500/80 z-10" />
                ) : (
                  <Icon className={`w-4 h-4 z-10 ${isActive ? "text-purple-300 animate-pulse" : "text-white/40"}`} />
                )}
                <span className="text-[8px] font-medium tracking-tight mt-1 uppercase z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
