import React, { useState } from "react";
import { useEffect } from "react";

type Props = {
  reiciveDataTime: Date | null;
  onRefreshLoading: (loading: boolean) => void;
  loading: boolean;
};

const StationReceiveTime: React.FC<Props> = ({
  reiciveDataTime,
  onRefreshLoading,
  loading,
}) => {
  const [addSec, setAddSec] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAddSec((addSec) => addSec + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function calcDiffTime(reiciveDataTime: Date | null): string {
    if (reiciveDataTime === null) {
      return "";
    }

    const diffTime = new Date().getTime() - reiciveDataTime?.getTime();
    const parsedSec = diffTime / 1000;

    let hour = 0;
    let min = 0;
    let sec = 0;

    if (parsedSec / 60 > 60) {
      hour = Math.floor(parsedSec / 60 / 60);
      min = Math.floor((parsedSec / 60) % 60);
      sec = Math.floor(((parsedSec / 60) % 60) % 60);

      return `${hour}시 ${min}분 ${sec}초`;
    }

    min = Math.floor(parsedSec / 60);
    sec = Math.floor(parsedSec % 60);

    return min > 0 ? `${min}분 ${sec}초` : `${sec}초`;
  }

  return (
    <div className="flex flex-col bg-white rounded-lg p-6">
      <div className="flex items-center">
        <p className="text-sm font-semibold text-slate-700">데이터 수신 시간</p>
        <button
          onClick={() => {
            onRefreshLoading(true);
          }}
          className="p-2 text-blue-600 disabled:text-slate-300 disabled:cursor-not-allowed rounded-lg"
          title="데이터 새로고침"
        >
          <svg
            className={`w-6 h-6 inline-block ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
      <div className="flex">
        <p className="text-lg font-bold text-slate-900">
          {calcDiffTime(reiciveDataTime) || "로딩중..."}
        </p>
      </div>
    </div>
  );
};

export default StationReceiveTime;
