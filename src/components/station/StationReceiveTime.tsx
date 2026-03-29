import React, { useState } from "react";
import { useEffect } from "react";
import SpinIcon from "./icon/SpinIcon";

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
    <div className="flex flex-col bg-white rounded-lg pl-6">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-slate-700">
          데이터 수신 시간 :
        </span>
        <div className="flex ml-2">
          <span className="text-lg font-bold text-slate-900">
            {calcDiffTime(reiciveDataTime) || "로딩중..."}
          </span>
        </div>
        <button
          onClick={() => {
            onRefreshLoading(true);
          }}
          className="p-2 cursor-pointer text-blue-600 disabled:text-slate-300 disabled:cursor-not-allowed rounded-lg"
          title="데이터 새로고침"
        >
          <SpinIcon loading={loading} speed="fast" />
        </button>
      </div>
    </div>
  );
};

export default StationReceiveTime;
