import React from "react";
import { toStringSecond } from "@/utils/time";

type Props = {
  addSec: number;
};

const StationReceiveTime: React.FC<Props> = ({ addSec }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg mt-3 md:mt-6">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-slate-700">
          데이터 수신 시간 :
        </span>
        <div className="flex ml-2">
          <span className="text-lg font-bold text-slate-900">
            {toStringSecond(addSec) || "로딩중..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StationReceiveTime;
