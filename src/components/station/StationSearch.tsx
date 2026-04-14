import { metroEngine } from "@/core/metroEngine";
import React, { useMemo, useState, useEffect, useRef } from "react";

import { getChoseong } from "es-hangul";
import SpinIcon from "./icon/SpinIcon";
import { StationInfo } from "@/types/stationType";
import { BLACK_COLOR, WHITE_COLOR } from "./constants";
import { REFRESH_INTERVAL_OPTIONS, RefreshInterval } from "./enums";
import { useTimerStore, type TimerState } from "@/store/timerStore";

interface SearchProps {
  onChangeStaion: (stationInfo: StationInfo) => void;
  onRefreshData: () => void;
  loading: boolean;
  scrollStatus: string;
  stationColor: string;
  isOpensearchList: boolean;
  setIsOpensearchList: React.Dispatch<React.SetStateAction<boolean>>;
  type: "TOP" | "FIXED";
  isSearched: boolean;
}

const StationSearch: React.FC<SearchProps> = ({
  onChangeStaion,
  onRefreshData,
  isOpensearchList,
  setIsOpensearchList,
  loading,
  scrollStatus,
  stationColor,
  type,
  isSearched,
}) => {
  const [keyword, setKeyword] = useState("");
  const [isRefreshMenuOpen, setIsRefreshMenuOpen] = useState(false);

  const refreshInterval = useTimerStore(
    (state: TimerState) => state.refreshInterval,
  );
  const setRefreshInterval = useTimerStore(
    (state: TimerState) => state.setRefreshInterval,
  );

  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsRefreshMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredStations: StationInfo[][] = useMemo(() => {
    const stationNames = metroEngine.getStationNames();
    const filterdNames = stationNames.filter((stationName) => {
      return matchKorean(stationName, keyword);
    });

    if (!filterdNames || keyword === "") {
      return [];
    }
    return filterdNames.map((name) => {
      const stationCodeSet = metroEngine.getStationCodesByName(name);
      if (stationCodeSet) {
        const stationCodes = [...stationCodeSet.values()];
        return stationCodes.map((code) => {
          return metroEngine.getStationInfoByCode(code)!;
        });
      } else {
        return [];
      }
    });
  }, [keyword]);

  const buttonTextColor =
    stationColor === WHITE_COLOR ? BLACK_COLOR : WHITE_COLOR;
  const bolderColor = stationColor === WHITE_COLOR ? "black" : stationColor;

  const refreshButtonColor = isSearched ? stationColor : WHITE_COLOR;

  let className = "relative";

  if (type === "FIXED") {
    className =
      scrollStatus === "INIT"
        ? "hidden"
        : "fixed left-0 w-screen px-6 md:px-8 translate-y-0";
  }

  function matchKorean(text: string, keyword: string) {
    if (!keyword) return true;

    const normalizedText = text.replace("역", "");
    const normalizedKeyword = keyword.replace("역", "");

    return (
      normalizedText.includes(normalizedKeyword) || // 일반 검색
      getChoseong(normalizedText).includes(normalizedKeyword) // 초성 검색
    );
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const keyword = e.target.value;
    setKeyword(keyword);
    setIsOpensearchList(true);
  }

  function handleSelect(station: StationInfo) {
    if (!station) {
      return;
    }
    setKeyword(station.station_name);
    setIsOpensearchList(false);
    onChangeStaion(station);
  }

  function hanldeOnRefreshClick(value: RefreshInterval): void {
    if (isSearched) {
      isSearched;
    }
    setRefreshInterval(value);
    setIsRefreshMenuOpen(false);
  }

  return (
    <div className={`${className} py-3 md:py-6 top-0 z-10 bg-white`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            id="search"
            value={keyword}
            onChange={handleChange}
            onFocus={() => {
              setIsOpensearchList(true);
            }}
            onClick={() => {
              setIsOpensearchList(true);
            }}
            type="text"
            placeholder="역명을 입력하세요 (예: 강남역)"
            className="w-full px-4 py-3 rounded-lg text-sm border"
            style={{ border: `1px solid ${bolderColor}` }}
          />
          {keyword && (
            <button
              onClick={() => {
                setKeyword("");
                setIsOpensearchList(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          )}
          {isOpensearchList && filteredStations.length > 0 && (
            <ul className="bg-white absolute z-10 w-full border rounded-lg mt-1 max-h-48 overflow-y-auto">
              {filteredStations.map((stations) => {
                return stations.map((station) => {
                  const stationName = station.station_name;

                  return (
                    <li
                      key={station?.station_code}
                      className="px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-zinc-300"
                      onClick={() => handleSelect(station)}
                    >
                      {/* 역명 */}
                      <span>{stationName}</span>

                      <div className="flex gap-1">
                        <span
                          title={station.line_number}
                          className="w-3 h-3 rounded-full"
                          style={{ background: station.color }}
                        />
                      </div>
                    </li>
                  );
                });
              })}
            </ul>
          )}
        </div>

        <button
          onClick={onRefreshData}
          className="w-12 h-12 flex justify-center items-center rounded-lg cursor-pointer border transition-transform active:scale-95"
          style={{
            backgroundColor: stationColor,
            border: `1px solid ${bolderColor}`,
          }}
          title="지금 새로고침"
        >
          <SpinIcon speed={"slow"} loading={loading} color={buttonTextColor} />
        </button>

        {/* 자동 갱신 설정 버튼 */}
        <div ref={menuRef}>
          <button
            onClick={() => setIsRefreshMenuOpen(!isRefreshMenuOpen)}
            className={`
    w-12 h-12 flex justify-center items-center rounded-lg border
    transition-all active:scale-95
    ${isSearched ? "cursor-pointer" : "opacity-40 cursor-pointer pointer-events-none"}
  `}
            style={{
              backgroundColor: refreshButtonColor,
              border: `1px solid ${bolderColor}`,
            }}
            title="자동 갱신 설정"
          >
            <div
              className="w-4 h-4  [clip-path:polygon(50%_100%,0_0,100%_0)]"
              style={{ backgroundColor: buttonTextColor }}
            ></div>
          </button>

          {isRefreshMenuOpen && (
            <div
              className="absolute right-0 mt-2 rounded-lg bg-white border shadow-lg z-20 min-w-40"
              style={{ border: `1px solid ${bolderColor}` }}
            >
              {REFRESH_INTERVAL_OPTIONS.map(({ label, value }, index) => (
                <button
                  key={value}
                  onClick={() => hanldeOnRefreshClick(value)}
                  className={`w-full first:rounded-t-md last:rounded-b-md px-4 pt-3 pb-2 text-sm text-left hover:bg-slate-100 transition-colors 
                    
                      ${
                        refreshInterval === value
                          ? "font-semibold text-white"
                          : "text-slate-700"
                      }`}
                  style={
                    refreshInterval === value
                      ? { backgroundColor: stationColor }
                      : {}
                  }
                >
                  {label}
                  {refreshInterval === value && " ✓"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationSearch;
