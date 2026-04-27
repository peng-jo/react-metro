import { useMemo } from "react";
import {
  StationInfo,
  RealtimeArrivalInfo,
  SubwayLineInfo,
  DirectionLineEnum,
  DirectionValue,
  GraphNode,
} from "@/types/stationType";
import lineInfo from "@data/lineInfo.json";
import { metroEngine } from "@/core/metroEngine";

export function useFilteredArrivals(
  currentStation: StationInfo | undefined,
  arrivals: RealtimeArrivalInfo[],
) {
  const originLineNumber = currentStation?.lineNumberOrigin ?? "";
  const lineInfoData = lineInfo as SubwayLineInfo[];
  const stationCode = currentStation?.stationCode ?? "";

  if (arrivals.length === 0) {
    return {};
  }
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
          currentStation,
        ),
      ),
    [upNodes, filterdArrivalsByLine, currentStation],
  );

  const downFiltered = useMemo(
    () =>
      downNodes.map((node) =>
        filterByCurrentStation(
          filterArrivalsByDirection(filterdArrivalsByLine, node.direction),
          node,
          currentStation,
        ),
      ),
    [downNodes, filterdArrivalsByLine, currentStation],
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
  return arrivals?.filter((arrive) => {
    const lineInfo = lineInfoData.find((lineInfo) => {
      return lineInfo.subwayId === arrive.subwayId;
    });

    return lineInfo?.subwayName === originLineNumber;
  });
}

function filterArrivalsByDirection(
  arrivals: RealtimeArrivalInfo[],
  type: DirectionValue | undefined,
) {
  return arrivals.filter((arrival) => {
    if (type === "down") {
      return (
        arrival.upDownLine === DirectionLineEnum["DOWN"] ||
        arrival.upDownLine === DirectionLineEnum["INNER"]
      );
    } else if (type === "up") {
      return (
        arrival.upDownLine === DirectionLineEnum["UP"] ||
        arrival.upDownLine === DirectionLineEnum["OUTER"]
      );
    }
    return false;
  });
}

function filterByCurrentStation(
  arrivals: RealtimeArrivalInfo[],
  currentNode: GraphNode<string>,
  currentStation: StationInfo | undefined,
) {
  return arrivals.filter((arrival) => {
    const lineNumberOrigin = currentStation?.lineNumberOrigin;
    const arriveStationInformation = metroEngine.getStationInfo(
      arrival.arrivalMessageTertiary,
      lineNumberOrigin,
    );

    let terminateNodes;

    const terminalStation = metroEngine.getStationInfo(
      arrival.destinationStationName,
      lineNumberOrigin,
    );

    if (terminalStation && currentNode.direction) {
      terminateNodes = metroEngine
        .getstationGraphNodes(
          terminalStation.stationCode,
          currentNode.direction,
        )
        .filter((n) => n.direction === currentNode?.direction);
    } else {
      return false;
    }

    if (!terminateNodes) {
      return false;
    }

    const arriveStationCode = arriveStationInformation?.stationCode ?? "";
    const nextStationCode = currentNode.next;
    const prevStationCode = currentNode.prev;

    const arriveStationAhead = metroEngine.findAheadByNode(
      arriveStationCode,
      currentNode,
    );
    //전역이 지선일 경우 확인용도
    const arriveStationPrevAhead = metroEngine.findAheadByNode(
      prevStationCode,
      currentNode,
    );
    //당역도착
    if (arriveStationAhead === 0) {
      return true;
    }

    let terminteAhead = null;
    terminateNodes.forEach((terminateNode) => {
      const ahead = metroEngine.findAheadByNode(nextStationCode, terminateNode);
      if (ahead !== null) {
        terminteAhead = ahead;
      }
    });

    const exceptLineNumberOrigin = "02호선"; // 2호선은 순환선 이므로 예외처리
    const hasCurrentStation = arriveStationAhead !== null;
    const hasPrevStation = arriveStationPrevAhead !== null;
    const hasTerminateStation =
      exceptLineNumberOrigin === lineNumberOrigin || terminteAhead !== null;

    return hasCurrentStation && hasPrevStation && hasTerminateStation;
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
        const stationName = arrival.arrivalMessageTertiary;

        const stationInfo = metroEngine.getStationInfo(
          stationName,
          originLineNumber,
        );
        const targetStationCode = stationInfo?.stationCode;

        return {
          stationInfo: stationInfo,
          ahead: metroEngine.findAheadByNode(targetStationCode, node),
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

    let ahead = maxAheadInfo.ahead ?? 0;
    ahead = ahead < 5 ? 5 : ahead;
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
          (arr) =>
            arr.arrivalMessageTertiary === currentStationInfo.stationName,
        );
        upcomingStations.push({
          name: currentStationInfo.stationName,
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
