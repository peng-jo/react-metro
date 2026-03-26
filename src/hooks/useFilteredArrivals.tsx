import { useMemo } from "react";
import {
  StationInfo,
  RealtimeArrivalInfo,
  SubwayLineInfo,
  UpdnLineEnum,
  DirectionValue,
  GraphNode,
} from "@/types/stationType";
import lineInfo from "@data/lineInfo.json";
import { metroEngine } from "@/core/metroEngine";

export function useFilteredArrivals(
  station: StationInfo | undefined,
  arrivals: RealtimeArrivalInfo[],
) {
  const originLineNumber = station?.line_number_origin ?? "";
  const lineInfoData = lineInfo as SubwayLineInfo[];
  const stationCode = station?.station_code ?? "";

  const upNodes = useMemo(
    () => metroEngine.getstationGraphNodes(stationCode, "up"),
    [stationCode],
  );

  const downNodes = useMemo(
    () => metroEngine.getstationGraphNodes(stationCode, "down"),
    [stationCode],
  );

  const filterdArrivalsByLine = useMemo(
    () => filterArrivalsByLineNumber(arrivals, lineInfoData, originLineNumber),
    [arrivals, lineInfoData, originLineNumber],
  );

  const upFiltered = useMemo(
    () =>
      upNodes.map((node) =>
        filterByCurrentStation(
          filterArrivalsByDirection(filterdArrivalsByLine, node.direction),
          node,
          station,
        ),
      ),
    [upNodes, filterdArrivalsByLine, station],
  );

  const downFiltered = useMemo(
    () =>
      downNodes.map((node) =>
        filterByCurrentStation(
          filterArrivalsByDirection(filterdArrivalsByLine, node.direction),
          node,
          station,
        ),
      ),
    [downNodes, filterdArrivalsByLine, station],
  );

  const upStationsList = useMemo(
    () => getprevStationsList(upNodes, upFiltered, originLineNumber),
    [upNodes, upFiltered],
  );

  const downStationsList = useMemo(
    () => getprevStationsList(downNodes, downFiltered, originLineNumber),
    [downNodes, downFiltered],
  );

  return {
    upFiltered,
    downFiltered,
    upNodes,
    downNodes,
    upStationsList,
    downStationsList,
  };
}

function filterArrivalsByLineNumber(
  arrivals: RealtimeArrivalInfo[],
  lineInfoData: SubwayLineInfo[],
  originLineNumber: string,
) {
  return arrivals.filter((arrive) => {
    const lineInfo = lineInfoData.find((lineInfo) => {
      return lineInfo.SUBWAY_ID === arrive.subwayId;
    });

    return lineInfo?.SUBWAY_NAME === originLineNumber;
  });
}

function filterArrivalsByDirection(
  arrivals: RealtimeArrivalInfo[],
  type: DirectionValue | undefined,
) {
  return arrivals.filter((arrival) => {
    if (type === "down") {
      return (
        arrival.updnLine === UpdnLineEnum["DOWN"] ||
        arrival.updnLine === UpdnLineEnum["INNER"]
      );
    } else if (type === "up") {
      return (
        arrival.updnLine === UpdnLineEnum["UP"] ||
        arrival.updnLine === UpdnLineEnum["OUTER"]
      );
    }
    return false;
  });
}

function filterByCurrentStation(
  arrivals: RealtimeArrivalInfo[],
  node: GraphNode<string>,
  station: StationInfo | undefined,
) {
  return arrivals.filter((arrival) => {
    const lineNumberOrigin = station?.line_number_origin;
    const stationInformation = metroEngine.getStationInfo(
      arrival.arvlMsg3,
      lineNumberOrigin,
    );

    let terminateNode;

    const terminalStation = metroEngine.getStationInfo(
      arrival.bstatnNm,
      lineNumberOrigin,
    );

    if (terminalStation && node.direction) {
      const terminateNodes = metroEngine.getstationGraphNodes(
        terminalStation.station_code,
        node.direction,
      );
      terminateNode = terminateNodes.find(
        (n) => n.direction === node?.direction,
      );
    } else {
      return false;
    }

    if (!terminateNode) {
      return false;
    }

    const targetStationCode = stationInformation?.station_code ?? "";
    const targetNextStationCode = node.next;
    const ahead = metroEngine.findAhead(targetStationCode, node);
    const terminteAhead = metroEngine.findAhead(
      targetNextStationCode,
      terminateNode,
    );

    const hasPrevious = ahead !== null;
    const hasTerminateNodePrevious = terminteAhead !== null;

    return hasPrevious && hasTerminateNodePrevious;
  });
}

function getprevStationsList(
  nodes: GraphNode<string>[],
  filtered: RealtimeArrivalInfo[][],
  originLineNumber: string,
) {
  return filtered.map((arrivals, index) => {
    const node = nodes[index];
    const upcomingStations: {
      name: string;
      staying: boolean;
      arrivalTime: string;
    }[] = [];

    const maxAheadInfo = arrivals
      .map((arrival) => {
        const stationName = arrival.arvlMsg3;

        const stationInfo = metroEngine.getStationInfo(
          stationName,
          originLineNumber,
        );
        const targetStationCode = stationInfo?.station_code;

        return {
          stationInfo: stationInfo,
          ahead: metroEngine.findAhead(targetStationCode, node),
        };
      })
      .reduce(
        (acc, arrivalAheadInfo) => {
          if (!arrivalAheadInfo || !arrivalAheadInfo.ahead || !acc.ahead) {
            return acc;
          }
          if (acc.ahead < arrivalAheadInfo.ahead) {
            return arrivalAheadInfo;
          } else {
            return acc;
          }
        },
        { stationInfo: null, ahead: -1 },
      );

    const ahead = maxAheadInfo.ahead ?? 0;
    let nowAhead = 0;
    // prev를 따라가면서 upcoming stations 수집
    let currentNode: GraphNode<string> | null = node;

    while (nowAhead <= ahead) {
      // arrive 역 정보 찾기
      const currentStationCode: string = currentNode?.current ?? "";
      const direction: string = currentNode?.direction ?? "";
      const currentStationInfo =
        metroEngine.getStationInfoByCode(currentStationCode);

      if (currentStationInfo) {
        // 해당 역에 대한 도착 정보 찾기
        const arrival = arrivals.find(
          (arr) => arr.arvlMsg3 === currentStationInfo.station_name,
        );
        upcomingStations.push({
          name: currentStationInfo.station_name,
          staying: !!arrival,
          arrivalTime: "",
        });
      }

      //이전 노드로 이동
      if (currentStationCode && direction) {
        const prevStationCode: string = currentNode?.prev ?? "";
        const prevNodes = metroEngine.getstationGraphNodes(
          prevStationCode,
          direction,
        );
        const prevNode = prevNodes.find(
          (n) => n.current === prevStationCode && n.direction === direction,
        );
        currentNode = prevNode || null;
      }
      nowAhead++;
    }

    return upcomingStations.reverse();
  });
}
