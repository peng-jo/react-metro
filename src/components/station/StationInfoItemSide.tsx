import React, { useEffect, useState } from "react";
// import StationTopology from "@data/subInfo.json";
import { StationInfo } from "@/types/stationType";
import ArrowIcon from "./icon/ArrowIcon";

type directionUnion = "left" | "right";

type InfoSideProps = {
  station: StationInfo | undefined;
  direction: directionUnion;
  useArrowIcon: boolean;
};

const InfoSide: React.FC<InfoSideProps> = ({
  station,
  useArrowIcon,
  direction,
}) => {
  return (
    <div
      className="flex flex-1 flex-row items-center self-center gap-2.5 px-2.5 text-white font-semibold text-sm text-center "
      style={{
        justifyContent: direction === "right" ? "start" : "end",
      }}
    >
      {useArrowIcon && <ArrowIcon />}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold bg-white"
        style={{ color: station?.color || "#999" }}
      >
        {station?.front_code}
      </div>

      <span className="tracking-widest text-white">
        {station?.station_name}
      </span>
      <div className="flex flex-col">
        <span className="hidden xl:block">{station?.station_name_english}</span>
        {(station?.station_name_china || station?.station_name_japan) && (
          <div className="hidden 2xl:block">
            <span>{station?.station_name_china}</span>
            <span className="ml-3">{station?.station_name_japan}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSide;
