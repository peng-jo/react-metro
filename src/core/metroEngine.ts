import {
  GraphNode,
  StationInfo,
  StationTopology,
  SubwaymasterData,
} from "@/types/stationType";

import stationTopologyData from "@data/stationTopology.json";
import subwaymasterData from "@data/subwaymasterData.json";

class MetroEngine {
  private readonly stationMap = new Map<string, StationInfo>();
  private readonly stationGraph = new Map<string, GraphNode<string>[]>();
  private readonly stationNameCodeMap = new Map<string, Set<string>>();
  private readonly subwayMasterMap = new Map<string, SubwaymasterData>();

  constructor() {
    const topology = stationTopologyData as StationTopology[];
    this.init(topology, subwaymasterData);
  }

  private init(
    allStations: StationTopology[],
    subwayMasterData: SubwaymasterData[],
  ) {
    allStations.forEach((station) => {
      this.addStationMap(station);
      this.addGraph(station);
      this.addSearchIndex(station);
    });
    this.initSubwayMasterData(subwayMasterData);
  }

  private addSearchIndex(station: StationTopology) {
    const name = station.station_name;
    const stationCode = station.station_code;

    if (!this.stationNameCodeMap.has(name)) {
      this.stationNameCodeMap.set(name, new Set());
    }
    this.stationNameCodeMap.get(name)!.add(stationCode);
  }

  private addStationMap(station: StationTopology) {
    // function makeNode(station: StationTopology) {
    //   return {
    //     prev: station.prev,
    //     next: station.next,
    //     direction: station.direction,
    //   };
    // }

    if (!this.stationMap.has(station.station_code)) {
      this.stationMap.set(station.station_code, {
        station_code: station.station_code,
        station_name: station.station_name,
        line_number: station.line_number,
        color: station.color,
        station_name_english: station.station_name_english,
        station_name_china: station.station_name_china,
        station_name_japan: station.station_name_japan,
        line_number_origin: station.line_number_origin,
        front_code: station.front_code,
      });
    }
  }

  private addGraph(edge: StationTopology) {
    const code = edge.station_code;
    const direction = edge.direction;
    const key = code + direction;
    if (this.stationGraph.has(key) === false) {
      this.stationGraph.set(key, []);
    }

    const stationGraph = this.stationGraph.get(key)!;
    const uniqueKey = edge.prev + edge.next + edge.direction;
    //양 갈래길 일 경우
    stationGraph.push({
      key: uniqueKey,
      prev: edge.prev,
      current: code,
      next: edge.next,
      direction: edge.direction,
    });
  }

  private initSubwayMasterData(subwayMasterData: SubwaymasterData[]) {
    subwayMasterData.forEach((data) => {
      this.subwayMasterMap.set(data.STATION_CODE, data);
    });
  }

  getStationInfoByCode(code: string) {
    return this.stationMap.get(code);
  }

  getStationInfo(stationName = "", lineNumberOrigin = "") {
    const stationCodes = this.stationNameCodeMap.get(stationName)?.values();
    if (!stationCodes) {
      return null;
    }
    return Array.from(stationCodes)
      ?.map((code) => this.getStationInfoByCode(code))
      .find((station) => station?.line_number_origin === lineNumberOrigin);
  }

  getstationGraphNodes(code: string, direction: string): GraphNode<string>[] {
    const key = code + direction;
    const nodes = this.stationGraph.get(key) ?? [];
    return nodes;
  }

  getStationNames() {
    return [...this.stationNameCodeMap.keys()];
  }

  getStationCodesByName(stationName: string) {
    return this.stationNameCodeMap.get(stationName);
  }

  getSubwayMasterDataByCode(code: string) {
    return this.subwayMasterMap.get(code);
  }

  findAheadByNode(
    targetStationCode = "",
    currentNode: GraphNode<string>,
    ahead = 0,
  ): number | null {
    if (currentNode.current === targetStationCode) {
      return 0;
    }
    const visited = new Set<string>();
    const stack: { node: GraphNode<string>; distance: number }[] = [];
    stack.push({ node: currentNode, distance: ahead });

    while (stack.length > 0) {
      const { node, distance } = stack.pop()!;
      const previousCode = node.prev;
      if (previousCode === "") {
        continue;
      }
      if (previousCode === targetStationCode) {
        return distance + 1;
      }
      const prevNodes = this.getstationGraphNodes(
        previousCode,
        node.direction ?? "",
      );
      const filteredPrevNodes = prevNodes.filter(
        (n) => n.current === previousCode && n.direction === node.direction,
      );
      for (const prevNode of filteredPrevNodes) {
        if (!visited.has(prevNode.prev)) {
          visited.add(prevNode.prev);
          stack.push({ node: prevNode, distance: distance + 1 });
        }
      }
    }

    return null;
  }
}

export const metroEngine = new MetroEngine();
