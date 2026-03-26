import {
  GraphNode,
  StationInfo,
  StationTopology,
  SubwaymasterData,
} from "@/types/stationType";

import stationTopologyData from "@data/StationTopology.json";
import subwaymasterData from "@data/SubwaymasterData.json";

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
      this.initStationMap(station);
      this.initGraph(station);
      this.initSearchIndex(station);
    });
    this.initSubwayMasterData(subwayMasterData);
  }

  private initSearchIndex(station: StationTopology) {
    const name = station.station_name;
    const stationCode = station.station_code;

    if (!this.stationNameCodeMap.has(name)) {
      this.stationNameCodeMap.set(name, new Set());
    }
    this.stationNameCodeMap.get(name)!.add(stationCode);
  }

  private initStationMap(station: StationTopology) {
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

  private initGraph(edge: StationTopology) {
    const code = edge.station_code;
    const direction = edge.direction;
    const key = code + direction;
    if (!this.stationGraph.has(key)) {
      this.stationGraph.set(key, []);
    }

    const stationGraph = this.stationGraph.get(key);
    const uniqueKey = edge.prev + edge.next + edge.direction;
    stationGraph?.push({
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
      .filter(
        (station) => station?.line_number_origin === lineNumberOrigin,
      )?.[0];
  }

  getstationGraphNodes(code: string, direction: string): GraphNode<string>[] {
    const key = code + direction;
    const node = this.stationGraph.get(key) ?? [];

    return node;
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

  findAhead(
    targetStationCode = "",
    currentNode: GraphNode<string>,
    ahead = 0,
  ): number | null {
    const previousCode = currentNode.prev;
    const currentCode = currentNode.prev;
    const direction = currentNode.direction ?? "";

    if (previousCode === "") {
      return null;
    }
    if (targetStationCode === previousCode) {
      return ahead + 1;
    }

    if (currentCode === targetStationCode || !direction) {
      return 0;
    }
    const prevNodes = this.getstationGraphNodes(previousCode, direction);

    const prevNode = prevNodes.find((node) => node.current === previousCode);

    if (!prevNode) {
      return ahead;
    }

    return this.findAhead(targetStationCode, prevNode, ahead + 1);
  }
}

export const metroEngine = new MetroEngine();
