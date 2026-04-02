import React from "react";
type Props = {
  reiciveDataTimeText: string;
};

const StationReceiveTime: React.FC<Props> = ({ reiciveDataTimeText }) => {
  return (
    <div className="ml-6 flex flex-col bg-white rounded-lg">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-slate-700">
          데이터 수신 시간 :
        </span>
        <div className="flex ml-2">
          <span className="text-lg font-bold text-slate-900">
            {reiciveDataTimeText || "로딩중..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StationReceiveTime;
