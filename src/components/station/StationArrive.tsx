import React, { useEffect, useState } from "react";

import {
  ArrivalCodeEnum,
  ArrivalCodeValue,
  DirectionValue,
  GraphNode,
  RealtimeArrivalInfo,
  StationInfo,
  UpdnLineEnum,
} from "@/types/stationType";

import { metroEngine } from "@/core/metroEngine";

const Arrive: React.FC<{
  arrivals: RealtimeArrivalInfo[];
  baseNode: GraphNode<string>;

  station: StationInfo | undefined;
}> = ({ arrivals, baseNode, station }) => {
  const getArrivalText = (code: ArrivalCodeValue) => {
    const statusMap: { [code]: { text: string; color: string } } = {
      [ArrivalCodeEnum.ENTRY]: {
        text: "진입",
        color: "bg-blue-100 text-blue-800",
      },
      [ArrivalCodeEnum.ARRIVED]: {
        text: "도착",
        color: "bg-green-100 text-green-800",
      },
      [ArrivalCodeEnum.DEPARTED]: {
        text: "출발",
        color: "bg-gray-100 text-gray-800",
      },
      [ArrivalCodeEnum.TERMINAL_DEPARTED]: {
        text: "전역출발",
        color: "bg-gray-100 text-gray-800",
      },
      [ArrivalCodeEnum.TERMINAL_ENTRY]: {
        text: "전역진입",
        color: "bg-blue-100 text-blue-800",
      },
      [ArrivalCodeEnum.TERMINAL_ARRIVED]: {
        text: "전역도착",
        color: "bg-green-100 text-green-800",
      },
      [ArrivalCodeEnum.RUNNING]: {
        text: "운행중",
        color: "bg-yellow-100 text-yellow-800",
      },
    };
    return (
      statusMap[code] || {
        text: "알 수 없음",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

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

    const ahead = metroEngine.findAhead(targetStationCode, baseNode, 0);

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

  return (
    <React.Fragment>
      {/* Table View for Desktop */}
      <div className="overflow-x-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
          {/* Table */}
          {arrivals.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-3 py-3 text-sm font-semibold text-slate-900">
                    상하행선
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-900">
                    종착역
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-slate-900">
                    위치
                  </th>

                  <th className="px-6 py-3 text-sm font-semibold text-slate-900">
                    상태
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-900">
                    현재 위치
                  </th>
                </tr>
              </thead>
              <tbody>
                {arrivals.map((arrive, index) => {
                  const status = getArrivalText(arrive.arvlCd);
                  return (
                    <tr
                      key={index}
                      className="border-b border-slate-200 text-center"
                    >
                      {/* 상하행선 */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {arrive.updnLine}
                      </td>
                      {/* 종착역 */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {arrive.bstatnNm} 행
                      </td>
                      {/* 위치 */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {getStationsAheadText(station, arrive.arvlMsg3)}
                      </td>

                      {/* 상태 */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      {/* 현재 위치 */}
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {arrive.arvlMsg3}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <div
                  className="loading"
                  style={{
                    borderColor: "transparent #3b82f6 transparent #3b82f6",
                  }}
                ></div>
                <p className="text-slate-600 font-medium text-lg">
                  데이터 로딩 중...
                </p>
                <p className="text-slate-500 text-sm">
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
