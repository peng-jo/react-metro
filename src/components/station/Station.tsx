import React, { useCallback } from "react";

import StationInfoReceiveTime from "./StationReceiveTime";

import { metroEngine } from "@/core/metroEngine";

import Search from "./StationSearch";
import StationInfoList from "./StationInfoList";
import StationCodeButtons from "./StationCodeButtons";

import { useStation } from "@/hooks/useStation";
import { useScrollStatus } from "@/hooks/useScrollStatus";

import { StationInfo } from "@/types/stationType";

const Station: React.FC = () => {
  const {
    arrivals,
    isOpensearchList,
    setIsOpensearchList,
    addSec,
    setStationName,
    loading,
    selectedCode,
    setSelectedCode,
    selectedCodes,
    setSelectedCodes,
    reFetchData,
    query,
  } = useStation();

  const scrollStatus = useScrollStatus();

  const handleChangeStation = useCallback(
    (stationInfo: StationInfo) => {
      if (stationInfo) {
        setStationName(stationInfo.station_name);
        setSelectedCode(stationInfo.station_code);
        const stationCodes = metroEngine.getStationCodesByName(
          stationInfo.station_name,
        );
        setSelectedCodes(stationCodes);
      }
    },
    [setStationName, setSelectedCode, setSelectedCodes],
  );

  const station = metroEngine.getStationInfoByCode(selectedCode);
  const color = station?.color ?? "#FFFFFF";
  const isSearched = arrivals.length > 0;

  const searchProps = {
    onChangeStaion: handleChangeStation,
    onRefreshData: () => reFetchData(query),
    loading,
    isOpensearchList,
    setIsOpensearchList,
    scrollStatus,
    stationColor: color,
    isSearched,
  };

  return (
    <div>
      <Search type="TOP" {...searchProps} />
      <Search type="FIXED" {...searchProps} />

      {isSearched && <StationInfoReceiveTime addSec={addSec} />}
      {isSearched && (
        <StationCodeButtons
          selectedCodes={selectedCodes}
          selectedCode={selectedCode}
          onSelectCode={setSelectedCode}
        />
      )}

      {isSearched && <StationInfoList station={station} arrivals={arrivals} />}
    </div>
  );
};

export default Station;
