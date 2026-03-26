import React from "react";

import StationInfoReceiveTime from "./StationReceiveTime";

import { metroEngine } from "@/core/metroEngine";

import Search from "./StationSearch";
import StationInfoList from "./StationInfoList";

import { useStation } from "@/hooks/useStation";

const Station: React.FC = () => {
  const { station, loadStation, loading } = useStation();

  const { stationName, searchCodes, arrivals, receiveTime } = station;

  function handleChangeStation(stationName: string) {
    const stationCodes = metroEngine.getStationCodesByName(stationName);
    const values = stationCodes?.values();

    if (values) {
      loadStation(stationName, [...values]);
    }
  }

  async function handleLoaing(refreshing: boolean) {
    await loadStation(stationName, searchCodes);
  }

  return (
    <React.Fragment>
      <Search onChangeStaion={handleChangeStation} />
      {arrivals.length > 0 && (
        <StationInfoReceiveTime
          onRefreshLoading={handleLoaing}
          loading={loading}
          reiciveDataTime={receiveTime}
        />
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
