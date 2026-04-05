import React, { useEffect, useState } from "react";

import StationInfoReceiveTime from "./StationReceiveTime";

import { metroEngine } from "@/core/metroEngine";

import Search from "./StationSearch";
import StationInfoList from "./StationInfoList";

import { useStation } from "@/hooks/useStation";
import { useScrollStatus } from "@/hooks/useScrollStatus";
import { useFetch } from "@/hooks/useFetch";
import { StationInfo } from "@/types/stationType";

const Station: React.FC = () => {
  const [stationName, setStationName] = useState("");
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const query = stationName ? `metro/${stationName}` : null;

  const { data, loading, error, reFetchData } = useFetch(query);
  const { arrivals, addSec, isOpensearchList, setIsOpensearchList } =
    useStation(data);

  const scrollStatus = useScrollStatus();
  const receiveTimeText = calcDiffTime(addSec);

  function calcDiffTime(addSec: number): string {
    const parsedSec = addSec;

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

  function handleChangeStation(stationInfo: StationInfo) {
    if (stationInfo) {
      setStationName(stationInfo.station_name);
      setSelectedCode(stationInfo.station_code);
      const stationCodes = metroEngine.getStationCodesByName(
        stationInfo.station_name,
      );
      setSelectedCodes(stationCodes);
    }
  }

  const station = metroEngine.getStationInfoByCode(selectedCode);
  const color = station?.color ?? "#FFFFFF";

  return (
    <div>
      <Search
        onChangeStaion={handleChangeStation}
        onRefreshData={() => reFetchData(query)}
        loading={loading}
        isOpensearchList={isOpensearchList}
        setIsOpensearchList={setIsOpensearchList}
        scrollStatus={scrollStatus}
        stationColor={color}
      />

      {arrivals.length > 0 && (
        <StationInfoReceiveTime reiciveDataTimeText={receiveTimeText} />
      )}
      <div className="flex mt-3 md:mt-6">
        {arrivals.length > 0 &&
          selectedCodes.map((code, index) => {
            const stationInfo = metroEngine.getStationInfoByCode(code);
            const { color = "#2B7FFF", station_code: stationCode } =
              stationInfo ?? {};

            return (
              <button
                key={code}
                onClick={() => setSelectedCode(code)}
                className={`
                  px-2 py-1 sm:px-3 sm:py-2 mr-2
                  rounded-lg flex items-center justify-center
                  text-white text-xs sm:text-sm font-bold
                  cursor-pointer select-none
                  transition-all active:scale-95
                  ${selectedCode === code ? "scale-110" : "scale-100"}
                `}
                style={{ backgroundColor: color }}
              >
                {stationCode}
              </button>
            );
          })}
      </div>

      {arrivals.length > 0 &&
        selectedCodes.map((code) => {
          return (
            <div
              key={code}
              style={{ display: selectedCode === code ? "block" : "none" }}
            >
              <StationInfoList station={station} arrivals={arrivals} />
            </div>
          );
        })}
    </div>
  );
};

export default Station;
