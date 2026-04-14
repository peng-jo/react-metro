export type RefreshInterval = 0 | 15 | 30 | 60;

export interface RefreshIntervalOption {
  label: string;
  value: RefreshInterval;
}

export const REFRESH_INTERVAL_OPTIONS: RefreshIntervalOption[] = [
  { label: "비활성화", value: 0 },
  { label: "15초", value: 15 },
  { label: "30초", value: 30 },
  { label: "1분", value: 60 },
];
