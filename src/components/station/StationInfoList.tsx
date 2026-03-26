import React from "react";

import { StationInfo, RealtimeArrivalInfo } from "@/types/stationType";

import StationArrive from "./StationArrive";
import StationInfoItem from "./StationInfoItem";
import TrainPosition from "./TrainPosition";
import { useFilteredArrivals } from "@/hooks/useFilteredArrivals";

interface InfoProps {
  station: StationInfo | undefined;
  arrivals: RealtimeArrivalInfo[];
}

const Infos: React.FC<InfoProps> = ({ station, arrivals }) => {
  const {
    upFiltered,
    downFiltered,
    upNodes,
    downNodes,
    upStationsList,
    downStationsList,
  } = useFilteredArrivals(station, arrivals);

  return (
    <div>
      <React.Fragment>
        {upNodes.map((node, index) => {
          const filtered = upFiltered[index];
          const upcomingStations = upStationsList[index];
          return (
            <div key={node.key}>
              <StationInfoItem station={station} node={node} />
              <TrainPosition
                upcomingStations={upcomingStations}
                lineColor={station?.color ?? ""}
              />
              <StationArrive
                station={station}
                baseNode={node}
                arrivals={filtered}
              />
            </div>
          );
        })}
        {downNodes.map((node, index) => {
          const filtered = downFiltered[index];
          const upcomingStations = downStationsList[index];
          return (
            <div key={node.key}>
              <StationInfoItem station={station} node={node} />
              <TrainPosition
                upcomingStations={upcomingStations}
                lineColor={station?.color ?? ""}
              />
              <StationArrive
                station={station}
                baseNode={node}
                arrivals={filtered}
              />
            </div>
          );
        })}
      </React.Fragment>
    </div>
  );
};

export default Infos;
