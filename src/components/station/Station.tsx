import React, { useEffect, useState } from "react";

import StationInfoReceiveTime from "./StationReceiveTime";

import { metroEngine } from "@/core/metroEngine";

import Search from "./StationSearch";
import StationInfoList from "./StationInfoList";

import { useStation } from "@/hooks/useStation";
import { useScrollStatus } from "@/hooks/useScrollStatus";

const Station: React.FC = () => {
  const { station, loadStation, loading } = useStation();
  const { stationName, searchCodes, arrivals, receiveTime } = station;
  const [addSec, setAddSec] = useState(0);
  const receiveTimeText = calcDiffTime(receiveTime);

  const scrollStatus = useScrollStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      setAddSec((addSec) => addSec + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  function handleChangeStation(stationName: string) {
    const stationCodes = metroEngine.getStationCodesByName(stationName);
    const values = stationCodes?.values();

    if (values) {
      loadStation(stationName, [...values]);
    }
  }

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

  async function handleLoaing() {
    await loadStation(stationName, searchCodes);
  }

  return (
    <React.Fragment>
      <Search
        onChangeStaion={handleChangeStation}
        onRefreshLoading={handleLoaing}
        loading={loading}
        receiveTimeText={receiveTimeText}
        scrollStatus={scrollStatus}
      />

      {arrivals.length > 0 && (
        <StationInfoReceiveTime reiciveDataTimeText={receiveTimeText} />
      )}
      {searchCodes &&
        searchCodes.map((code) => {
          const station = metroEngine.getStationInfoByCode(code);
          return (
            <React.Fragment key={code}>
              <StationInfoList station={station} arrivals={arrivals} />
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
};

export default Station;
