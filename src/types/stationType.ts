export const DirectionEnum = {
  UP: "up",
  DOWN: "down",
} as const;

export type DirectionValue = (typeof DirectionEnum)[keyof typeof DirectionEnum];

// export const BranchType = "main";

export interface StationTopology {
  /** N호선 */
  lineNumber: string;
  stationNameEnglish: string;
  /** 전철역명 */
  stationName: string;
  /** 전철역명(중문) */
  stationNameChina: string;
  /** 전철역명(일문) */
  stationNameJapan: string;
  /** 호선 */
  lineNumberOrigin: string;
  /** 전철역코드 */
  stationCode: string;
  /** 외부코드 */
  frontCode: string;
  /** 전철고유색상 */
  color?: string;
  /** 지선정보 */
  branch: string;
  /** 역 계통(default | 'P') */
  service: string;
  /** 이전역(전철역코드) */
  prev: string;
  /** 다음역(전철역코드) */
  next: string;
  /** 상행하행 */
  direction: DirectionValue;
}

export type GraphNode<T> = {
  prev: T;
  next: T;
  current: T;
  key: string;
  direction?: DirectionValue;
};

export type StationInfo = Omit<
  StationTopology,
  "prev" | "next" | "direction" | "branch" | "service"
>;

export const ArrivalCodeEnum = {
  ENTRY: "0", // 진입
  ARRIVED: "1", // 도착
  DEPARTED: "2", // 출발
  TERMINAL_DEPARTED: "3", // 전역출발
  TERMINAL_ENTRY: "4", // 전역진입
  TERMINAL_ARRIVED: "5", // 전역도착
  RUNNING: "99", // 운행중
} as const;

export const LastCarAtEnum = {
  YES: "1",
  NO: "0",
} as const;

export const TrainStatusEnum = {
  EXPRESS: "급행",
  ITX: "ITX",
  GENERAL: "일반",
  SPECIAL: "특급",
} as const;

export const SubwayLineEnum = {
  LINE_1: "1001",
  LINE_2: "1002",
  LINE_3: "1003",
  LINE_4: "1004",
  LINE_5: "1005",
  LINE_6: "1006",
  LINE_7: "1007",
  LINE_8: "1008",
  LINE_9: "1009",
  JUNGANG: "1061", // 중앙선
  GYEONGUI_JUNGANG: "1063", // 경의중앙선
  AIRPORT: "1065", // 공항철도
  GYEONGCHUN: "1067", // 경춘선
  SUIN_BUNDANG: "1075", // 수인분당선
  SINBUNDANG: "1077", // 신분당선
  UI_SINSEOL: "1092", // 우이신설선
  SEOHAE: "1093", // 서해선
  GYEONGGANG: "1081", // 경강선
  GTX_A: "1032", // GTX-A
} as const;

export const DirectionLineEnum = {
  UP: "상행",
  OUTER: "외선",
  DOWN: "하행",
  INNER: "내선",
} as const;

export type ArrivalCodeValue =
  (typeof ArrivalCodeEnum)[keyof typeof ArrivalCodeEnum];
export type LastCarAtValue = (typeof LastCarAtEnum)[keyof typeof LastCarAtEnum];
export type TrainStatusValue =
  (typeof TrainStatusEnum)[keyof typeof TrainStatusEnum];
export type SubwayLineValue =
  (typeof SubwayLineEnum)[keyof typeof SubwayLineEnum];
export type DirectionLineValue =
  (typeof DirectionLineEnum)[keyof typeof DirectionLineEnum];

export type RealtimeArrivalInfo = {
  beginRow: null; // 페이징 시작 행
  endRow: null; // 페이징 종료 행
  curPage: null; // 현재 페이지
  pageRow: null; // 페이지당 행 수
  totalCount: number; // 총 데이터 건수
  rowNum: number; // 행 번호
  selectedCount: number; // 선택된 건수
  subwayId: SubwayLineValue; // 지하철호선ID (1001:1호선, 1002:2호선, ...)
  subwayName: null; // 지하철명
  upDownLine: DirectionLineValue; // 상하행선구분 (상행/내선, 하행/외선)
  trainLineName: string; // 도착지방면 (성수행 - 구로디지털단지방면)
  subwayHeading: null; // 지하철 방향
  stationFrontId: string; // 이전지하철역ID
  stationTableId: string; // 다음지하철역ID
  stationId: string; // 지하철역ID
  stationName: string; // 지하철역명
  trainCompany: null; // 열차 회사
  transitCount: number; // 환승노선수
  orderKey: string; // 도착예정열차순번 (상하행코드+순번+첫번째도착정류장-현재정류장+목적지정류장+급행여부)
  subwayList: string; // 연계호선ID (1002, 1007 등 연계대상 호선ID)
  stationList: string; // 연계지하철역ID (1002000233, 1007000000)
  trainStatus: TrainStatusValue; // 열차종류 (급행,ITX,일반,특급)
  arrivalTime: string; // 열차도착예정시간 (단위:초)
  trainNumber: string; // 열차번호 (현재운행하고 있는 호선별 열차번호)
  destinationStationId: string; // 종착지하철역ID
  destinationStationName: string; // 종착지하철역명
  receptionDateTime: string; // 열차도착정보를 생성한 시각
  arrivalMessageSecondary: string; // 첫번째도착메세지 (도착, 출발, 진입 등)
  arrivalMessageTertiary: string; // 두번째도착메세지 (종합운동장 도착, 12분 후 (광명사거리) 등)
  arrivalCode: ArrivalCodeValue; // 도착코드 (0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중)
  lastCarAt: LastCarAtValue; // 막차여부 (1:막차, 0:일반)
  remainText?: string; // 계산된 경과시간 (선택적)
};

export type ReiciveDataTime = Date;

export type StationWithArrival = {
  station: StationTopology;
  arrivals: RealtimeArrivalInfo[];
  // reiciveDataTime: ReiciveDataTime;
};

export type SubwayLineInfo = {
  subwayId: SubwayLineValue;
  subwayName: string;
};

export interface SubwaymasterData {
  subwayId: string;
  stationCode: string;
  stationName: string;
  subwayName: string;
}

// type key = string; // makeKey 로 만든 그래프용 key
// export type StationSearchItem = key;
