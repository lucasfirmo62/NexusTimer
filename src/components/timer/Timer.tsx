import { useTimerStore } from "@/store/timerStore";
import SolveOptions from "./SolveOptions";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import translation from "@/translations/global.json";
import useTimer from "@/hooks/useTimer";
import Confetti from "react-dom-confetti";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";

const timerStatusClasses = {
  idle: "light:text-neutral-900 dark:text-white",
  holdingKey: "light:text-pink-600 dark:text-pink-600",
  solving: "light:text-neutral-700 dark:text-slate-200",
  ready: "text-emerald-400",
};

const config: any = {
  angle: 90,
  spread: 180,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 5000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

export default function Timer() {
  const { lang, settings } = useSettingsModalStore();
  const { selectedCube, isSolving, lastSolve } = useTimerStore();
  const { timerStatus, hideWhileSolving, solvingTime } = useTimer();
  const { global } = useTimerStatistics();

  if (selectedCube === null) return <></>;

  return (
    <>
      <div
        id="touch"
        className="flex flex-col items-center justify-center grow"
      >
        {selectedCube && (
          <div className={`${timerStatusClasses[timerStatus]}`}>
            {hideWhileSolving && isSolving ? (
              <span className="sm:text-5xl md:text-6xl lg:text-7xl">
                {translation.timer["solving"][lang]}
              </span>
            ) : (
              <div className="font-mono">
                <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                  {formatTime(solvingTime).split(".")[0]}
                </span>
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                  .{formatTime(solvingTime).split(".")[1]}
                </span>
              </div>
            )}
          </div>
        )}
        <Confetti
          active={
            global.best === lastSolve?.time &&
            !isSolving &&
            settings.alerts.bestTime.status
          }
          config={config}
        />
        {lastSolve &&
          settings.features.quickActionButtons.status &&
          timerStatus === "idle" && <SolveOptions solve={lastSolve} />}
      </div>
    </>
  );
}
