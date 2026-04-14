import { RealtimeArrivalInfo } from "@/types/stationType";
import { useEffect, useState } from "react";
import { useTimerStore, type TimerState } from "@/store/timerStore";
import { useFetch } from "./useFetch";

type Result = {
  realtimeArrivalList: RealtimeArrivalInfo[];
  errorMessage: {
    message: string;
    status: number;
  };
};

export function useStation() {
  const addSec = useTimerStore((state: TimerState) => state.addSec);
  const tick = useTimerStore((state: TimerState) => state.tick);
  const resetAddSec = useTimerStore((state: TimerState) => state.reset);
  const refreshInterval = useTimerStore(
    (state: TimerState) => state.refreshInterval,
  );

  const [stationName, setStationName] = useState("");
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [isOpensearchList, setIsOpensearchList] = useState(false);

  const query = stationName ? `metro/${stationName}` : null;
  const { data, loading, error, reFetchData } = useFetch(query);

  const arrivals: RealtimeArrivalInfo[] = data?.realtimeArrivalList ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      resetAddSec();
      clearInterval(interval);
    };
  }, [arrivals]);

  // 자동 갱신 로직
  useEffect(() => {
    if (!query || refreshInterval === 0) {
      return;
    }

    const intervalMs = refreshInterval * 1000;
    const timer = setInterval(() => {
      reFetchData(query);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [query, refreshInterval, arrivals]);

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
    addSec,
    loading,
    reFetchData,
    setStationName,
    isOpensearchList,
    setIsOpensearchList,
    selectedCodes,
    setSelectedCodes,
    selectedCode,
    setSelectedCode,
    query,
  };
}
