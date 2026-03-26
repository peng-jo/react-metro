import { RealtimeArrivalInfo } from "@/types/stationType";
import { useState } from "react";

interface State {
  stationName: string;
  arrivals: RealtimeArrivalInfo[];
  searchCodes: string[];
  receiveTime: Date | null;
}

const initialState: State = {
  stationName: "",
  arrivals: [],
  searchCodes: [],
  receiveTime: null,
};

export function useStation() {
  const [station, setStation] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadStation(stationName: string, stationCodes: string[]) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${stationName}`,
      );

      const { realtimeArrivalList, errorMessage, status } =
        await response.json();

      if (status !== 500 && errorMessage.status === 200) {
        setStation({
          stationName,
          arrivals: realtimeArrivalList,
          searchCodes: stationCodes,
          receiveTime: new Date(),
        });
      } else {
        setError("API ERROR");
      }
    } catch (e) {
      setError("NETWORK ERROR");
    } finally {
      setLoading(false);
    }
  }

  return { station, loadStation, loading, error };
}
