export const DirectionEnum = {
  UP: "up",
  DOWN: "down",
} as const;

export type DirectionValue = (typeof DirectionEnum)[keyof typeof DirectionEnum];

// export const BranchType = "main";

export interface StationTopology {
  /** N호선 */
  line_number: string;
  station_name_english: string;
  /** 전철역명 */
  station_name: string;
  /** 전철역명(중문) */
  station_name_china: string;
  /** 전철역명(일문) */
  station_name_japan: string;
  /** 호선 */
  line_number_origin: string;
  /** 전철역코드 */
  station_code: string;
  /** 외부코드 */
  front_code: string;
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

export const UpdnLineEnum = {
  UP: "상행",
  OUTER: "외선",
  DOWN: "하행",
  INNER: "내선",
} as const;

export type ArrivalCodeValue =
  (typeof ArrivalCodeEnum)[keyof typeof ArrivalCodeEnum];
export type LastCarAtValue = (typeof LastCarAtEnum)[keyof typeof LastCarAtEnum];
export type SubwayLineValue =
  (typeof SubwayLineEnum)[keyof typeof SubwayLineEnum];
export type UpdnLineValue = (typeof UpdnLineEnum)[keyof typeof UpdnLineEnum];

export type RealtimeArrivalInfo = {
  beginRow: null;
  endRow: null;
  curPage: null;
  pageRow: null;
  totalCount: number;
  rowNum: number;
  selectedCount: number;
  subwayId: SubwayLineValue;
  subwayNm: null;
  updnLine: UpdnLineValue;
  trainLineNm: string;
  subwayHeading: null;
  statnFid: string;
  statnTid: string;
  statnId: string;
  statnNm: string;
  trainCo: null;
  ordkey: string;
  subwayList: string;
  statnList: string;
  btrainSttus: string;
  barvlDt: string;
  btrainNo: string;
  bstatnId: string;
  bstatnNm: string;
  recptnDt: string;
  arvlMsg2: string;
  arvlMsg3: string;
  arvlCd: ArrivalCodeValue;
  lstcarAt: LastCarAtValue;
  remainText?: string;
};

export type ReiciveDataTime = Date;

export type StationWithArrival = {
  station: StationTopology;
  arrivals: RealtimeArrivalInfo[];
  // reiciveDataTime: ReiciveDataTime;
};

export type SubwayLineInfo = {
  SUBWAY_ID: SubwayLineValue;
  SUBWAY_NAME: string;
};

export interface SubwaymasterData {
  SUBWAY_ID: string;
  STATION_CODE: string;
  STATION_NAME: string;
  SUBWAY_NAME: string;
}

// type key = string; // makeKey 로 만든 그래프용 key
// export type StationSearchItem = key;
