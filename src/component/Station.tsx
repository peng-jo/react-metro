import React, { useCallback, useEffect, useState } from "react";
import subInfo from "../data/subInfo.json";
import StationInfo from "./StationInfo";


interface StationProps {
	selectedStation: string;
}

const Station: React.FC<StationProps> = (props: StationProps) => {
	const [result, setResult] = useState<{
		realtimeArrivalList: [];
	}>({ realtimeArrivalList: [] });

	const [loading, setLoading] = useState<boolean>(false);
	const [refreshTime, setRefreshTime] = useState<string>("");

	const refreshData = useCallback(() => {
		const requestOptions = {
			method: "GET",
		};
		setLoading(true);
		console.log("fetch", props.selectedStation);

		fetch(
			`https://peng-jo-proxy.herokuapp.com/metro/${props.selectedStation}`,
			requestOptions
		)
		.then((response) => response.text())
		.then((result) => {
			const parsed = JSON.parse(result);
			console.log(parsed);
			setLoading(false);
			if (parsed.status !== 500 && parsed.errorMessage.status === 200) {
				const nowDate = new Date().toLocaleString("ko-KR");
				setRefreshTime(nowDate.toString());
				setResult(parsed);
			}
		})
		.catch((error) => console.error(error));
  
	}, [props.selectedStation]);

	useEffect(() => {
		if (props.selectedStation.length > 0) {
			refreshData();
		}
  }, [props.selectedStation, refreshData]);

	useEffect(()=>{
		const target = document.querySelectorAll(".center > .icon");
		if (loading) {
			Array.prototype.map.call(target, (el) => el.classList.add("rotate"));
		} else {
			Array.prototype.map.call(target, (el) => el.classList.remove("rotate"));
		}
	}, [loading]);

	return (
    <React.Fragment>
      {props.selectedStation !== ""
        ? subInfo.DATA.filter(
            (station) => station.station_nm === props.selectedStation
          ).map((station) => {
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
                  loading={loading}
                  result={result.realtimeArrivalList}
                  line={station.line_num_origin}
                  selectedStation={props.selectedStation}
                  refreshTime={refreshTime}
                  refreshData={refreshData}
                />
              </div>
            );
          })
        : "수도권 역을 검색 입력해주세요..."}
    </React.Fragment>
  );
};

export default Station