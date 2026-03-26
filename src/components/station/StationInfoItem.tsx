import React from "react";

import { StationInfo, GraphNode } from "@/types/stationType";
import InfoSide from "./StationInfoItemSide";
import { metroEngine } from "@/core/metroEngine";

type InfoProps = {
  station: StationInfo | undefined;
  node: GraphNode<string>;
};

const StationInfoItem: React.FC<InfoProps> = ({ station, node }) => {
  const {
    station_name: stationName,
    station_name_china: stationNameChn,
    station_name_japan: stationNameJpn,
    station_code: stationCode,
    line_number_origin: stationNum,
    station_name_english: stationNameEng,
    front_code: frontCode,

    color,
  } = station ?? {};

  const prevStation = metroEngine.getStationInfoByCode(node.prev)!;
  const nextStation = metroEngine.getStationInfoByCode(node.next)!;

  return (
    <div
      key={stationCode}
      className="w-full flex flex-col items-center relative"
    >
      {/* band background */}
      <div
        className="w-full h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{ backgroundColor: station?.color || "#999" }}
      />
      <div className="flex w-full gap-y-8 my-8 z-1">
        {/* Previous Station*/}
        <InfoSide station={prevStation} direction="left" useArrowIcon={false} />

        <div
          className="flex items-center bg-white rounded-full justify-center border-6 relative py-2"
          style={{ minWidth: 300, borderColor: color }}
        >
          {/* Left badge overlaps */}
          <div className="hidden lg:block z-10 absolute left-5">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full text-white font-extrabold text-lg"
              style={{ backgroundColor: color }}
            >
              {frontCode}
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col text-center">
            <div className="text-2xl font-extrabold text-slate-900">
              {stationName}
            </div>
            <div className="text-sm text-slate-900 font-extrabold mt-0.5">
              {stationNameEng}
            </div>
            {(stationNameChn || stationNameJpn) && (
              <div className="hidden md:flex justify-center gap-3 text-xs text-slate-600 mt-1">
                {stationNameChn && (
                  <span className="font-medium">{stationNameChn}</span>
                )}
                {stationNameJpn && (
                  <span className="font-medium">{stationNameJpn}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Next */}
        <InfoSide station={nextStation} direction="right" useArrowIcon={true} />
      </div>
    </div>
  );
};

export default StationInfoItem;
