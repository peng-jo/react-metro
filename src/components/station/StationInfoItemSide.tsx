import React from "react";

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
      className="flex flex-1 flex-row items-center self-center gap-2.5 px-2.5 text-white font-semibold  text-center"
      style={{
        justifyContent: direction === "right" ? "start" : "end",
      }}
    >
      {useArrowIcon && <ArrowIcon />}
      <div
        className="hidden md:flex w-10 h-10 rounded-full items-center justify-center  text-white font-extrabold bg-white"
        style={{ color: station?.color || "#999" }}
      >
        {station?.frontCode}
      </div>

      <span className="tracking-widest text-white">{station?.stationName}</span>
      <div className="flex flex-col">
        <span className="hidden xl:block">{station?.stationNameEnglish}</span>
        {(station?.stationNameChina || station?.stationNameJapan) && (
          <div className="hidden 2xl:block">
            <span>{station?.stationNameChina}</span>
            <span className="ml-3">{station?.stationNameJapan}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSide;
