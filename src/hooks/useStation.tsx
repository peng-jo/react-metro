import { RealtimeArrivalInfo } from "@/types/stationType";
import { useEffect, useState } from "react";

type Result = {
  realtimeArrivalList: RealtimeArrivalInfo[];
  errorMessage: {
    message: string;
    status: number;
  };
};

export function useStation(result: Result) {
  const [addSec, setAddSec] = useState(0);
  const [isOpensearchList, setIsOpensearchList] = useState(false);

  const arrivals = result?.realtimeArrivalList ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      setAddSec((addSec) => addSec + 1);
    }, 1000);

    return () => {
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
