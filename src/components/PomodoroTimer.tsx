import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "work" | "break";

export const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [sessions, setSessions] = useState(0);

  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbJ7fzTfyoGLYDN8t2QQAoUXrTp66hVFApGn+DyvmwhBzbJ7fzTfyoGLYDN8tyJNwgZZ7vs"
);
      audio.play().catch(() => {});
      
      if (mode === "work") {
        setSessions(sessions + 1);
        setMode("break");
        setTime(breakDuration);
      } else {
        setMode("work");
        setTime(workDuration);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, mode, sessions, workDuration, breakDuration]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTime(mode === "work" ? workDuration : breakDuration);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = mode === "work" 
    ? ((workDuration - time) / workDuration) * 100
    : ((breakDuration - time) / breakDuration) * 100;

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center transition-all duration-1000",
      mode === "work" ? "bg-gradient-to-br from-[hsl(14,90%,60%)] to-[hsl(25,95%,53%)]" : "bg-gradient-to-br from-[hsl(175,70%,55%)] to-[hsl(195,75%,60%)]"
    )}>
      <div className="w-full max-w-md px-6 animate-fade-in">
        <Card className="p-8 backdrop-blur-sm bg-white/90 shadow-2xl">
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {mode === "work" ? "Focus Time" : "Break Time"}
              </h1>
              <p className="text-muted-foreground">Session {sessions}</p>
            </div>

            <div className="relative w-64 h-64 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="754"
                  strokeDashoffset={754 - (754 * progress) / 100}
                  className={cn(
                    "transition-all duration-1000",
                    mode === "work" ? "text-primary" : "text-accent"
                  )}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold tabular-nums">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={cn(
                  "w-24 h-24 rounded-full transition-all",
                  mode === "work" ? "bg-primary hover:bg-primary/90" : "bg-accent hover:bg-accent/90"
                )}
              >
                {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
                className="w-16 h-16 rounded-full self-center"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
