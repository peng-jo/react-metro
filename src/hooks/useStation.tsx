import { RealtimeArrivalInfo } from "@/types/stationType";
import { useEffect, useState } from "react";
import { useTimerStore, type TimerState } from "@/store/timerStore";

type Result = {
  realtimeArrivalList: RealtimeArrivalInfo[];
  errorMessage: {
    message: string;
    status: number;
  };
};

export function useStation(result?: Result) {
  const addSec = useTimerStore((state: TimerState) => state.addSec);
  const tick = useTimerStore((state: TimerState) => state.tick);
  const resetAddSec = useTimerStore((state: TimerState) => state.reset);
  const [isOpensearchList, setIsOpensearchList] = useState(false);
  const arrivals = result?.realtimeArrivalList ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      resetAddSec();
      clearInterval(interval);
    };
  }, [arrivals]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpensearchList(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return {
    arrivals: arrivals,
    receiveTime: new Date(),
    addSec: addSec,
    isOpensearchList,
    setIsOpensearchList,
  };
}
