import React, { useMemo } from "react";

import {
  GraphNode,
  RealtimeArrivalInfo,
  StationInfo,
} from "@/types/stationType";

import { metroEngine } from "@/core/metroEngine";
import { TimerState, useTimerStore } from "@/store/timerStore";
import { toStringSecond } from "@/utils/time";

const Arrive: React.FC<{
  arrivals: RealtimeArrivalInfo[];
  baseNode: GraphNode<string>;

  station: StationInfo | undefined;
}> = ({ arrivals, baseNode, station }) => {
  const addSec = useTimerStore((state: TimerState) => state.addSec);
  const parsedArrivals = useMemo(
    () =>
      arrivals.map((arrive) => {
        const remainText = getElapsedTime(arrive.recptnDt, addSec);

        return {
          ...arrive,
          remainText,
        };
      }) ?? [],
    [arrivals, addSec],
  );

  function getStationsAheadText(
    baseStation: StationInfo | undefined,
    targetStationName: string,
  ) {
    const targetStation = metroEngine.getStationInfo(
      targetStationName,
      baseStation?.line_number_origin,
    );
    if (!targetStation || !baseStation) {
      return "";
    }
    const targetStationCode = targetStation?.station_code;
    const ahead = metroEngine.findAheadByNode(targetStationCode, baseNode, 0);

    if (ahead === 0) {
      return "당역";
    } else if (ahead === 1) {
      return "전역";
    } else if (ahead === 2) {
      return "전전역";
    } else {
      return `${ahead} 전역`;
    }
  }

  function getElapsedTime(reception: string, addSec: number) {
    const startTime = new Date(reception).getTime();
    const now = Date.now();

    const parsedSec = Math.max(0, Math.floor((now - startTime) / 1000));

    return toStringSecond(parsedSec);
  }

  return (
    <React.Fragment>
      <div className="overflow-x-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200 overflow-x-auto">
          {/* Table */}
          {parsedArrivals.length > 0 ? (
            <table className="w-full border">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-semibold">
                  <th className="hidden md:block md:px-3 py-2 min-w-10">
                    상하행선
                  </th>
                  <th className="py-2 md:px-6 min-w-30">종착역</th>
                  <th className="md:px-3 py-2 min-w-20">위치</th>
                  <th className="md:px-6 py-2 min-w-30">현재 위치</th>
                  <th className="md:block md:px-6 py-2 min-w-20">경과</th>
                </tr>
              </thead>
              <tbody>
                {parsedArrivals.map((arrive, index) => {
                  return (
                    <tr
                      key={arrive.btrainNo}
                      className="border-b border-slate-200 text-center"
                    >
                      {/* 상하행선 */}
                      <td className="hidden md:block font-medium text-slate-900 py-2">
                        {arrive.updnLine}
                      </td>
                      {/* 종착역 */}
                      <td className="font-medium text-slate-900 py-2">
                        {arrive.bstatnNm} 행
                      </td>
                      {/* 위치 */}
                      <td className="font-medium text-slate-900 py-2">
                        {getStationsAheadText(station, arrive.arvlMsg3)}
                      </td>
                      {/* 현재 위치 */}
                      <td className="  text-slate-700 py-2">
                        {arrive.arvlMsg3}
                      </td>
                      {/* 데이터 기준 경과시간 */}
                      <td className="text-slate-700 py-2">
                        <span>{arrive.remainText}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-4">
                {/* <div className="flex justify-center items-center gap-3">
                  <span className="text-slate-600 font-medium text-lg">
                    데이터 로딩 중
                  </span>
                  <SpinIcon loading={true} speed="slow" />
                </div> */}

                <p className="text-slate-500 ">
                  운행 시간이 아니거나 API가 해당 역을 지원하지 않을 수 있습니다
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Arrive;
