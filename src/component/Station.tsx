import React, { useEffect, useState } from "react";
import { resultType } from "../@type/resultType";
import subInfo from "../data/subInfo.json";
import StationInfo from "./StationInfo";

interface StationProps {
  selectedStation: string;
}

const Station: React.FC<StationProps> = (props: StationProps) => {
   const [result, setResult] = useState<{
     realtimeArrivalList: [resultType];
   }>();
   useEffect(() => {
     if (props.selectedStation.length > 0) {
       const requestOptions = {
         method: "GET",
       };
       console.log("fetch", props.selectedStation);
        fetch(
          `https://peng-jo-proxy.herokuapp.com/metro/${props.selectedStation}`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            const parsed = JSON.parse(result);
            // console.log(parsed)
            if (parsed.status !== 500 && parsed.errorMessage.status === 200)
              setResult(parsed);
          })
          .catch((error) => console.error(error));
     }
   }, [props.selectedStation]);
  return (
    <React.Fragment>
      {
        props.selectedStation !== "" ?
        subInfo.DATA.filter((station) => station.station_nm === props.selectedStation).map(
          (station) => {
            const color = station.color;
            return (
              <div className="sation-info" key={station.station_nm + color}>
                <span
                  className="station"
                  style={{ border: `6px solid ${color}` }}
                >
                  <div className="station-header">
                    <div
                      className="num"
                      style={{
                        border: `3px solid ${color}`,
                        color: color,
                        fontSize: station.line_num.length > 1 ? "6px" : "13px",
                      }}
                    >
                      {station.line_num}
                    </div>
                    <div className="station-name">
                      {station.station_nm}역
                      <div className="station-sub-name">
                        {station.station_nm_eng}
                      </div>
                    </div>
                  </div>
                </span>
                <StationInfo
                  result={result}
                  line={station.line_num_origin}
                  selectedStation={props.selectedStation}
                />
              </div>
            );
          }
        ): "수도권 역을 검색 입력해주세요..."
      }
    </React.Fragment>
  );
};

export default Station


