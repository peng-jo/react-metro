import { metroEngine } from "@/core/metroEngine";
import React, { useMemo, useState } from "react";

import { getChoseong } from "es-hangul";
import SpinIcon from "./icon/SpinIcon";
import { StationInfo } from "@/types/stationType";
import { BLACK_COLOR, WHITE_COLOR } from "./constants";

interface SearchProps {
  onChangeStaion: (stationInfo: StationInfo) => void;
  onRefreshData: () => void;
  loading: boolean;
  scrollStatus: string;
  stationColor: string;
  isOpensearchList: boolean;
  setIsOpensearchList: React.Dispatch<React.SetStateAction<boolean>>;
  type: "TOP" | "FIXED";
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
}) => {
  const [keyword, setKeyword] = useState("");

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

  // function handleSearch() {
  //   if (!stationInfo) {
  //     return;
  //   }
  //   setOpen(false);
  //   onChangeStaion(stationInfo);
  // }

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
          className="p-3 rounded-lg cursor-pointer border"
          style={{
            backgroundColor: stationColor,
            border: `1px solid ${bolderColor}`,
          }}
        >
          <SpinIcon speed={"slow"} loading={loading} color={buttonTextColor} />
        </button>
      </div>
    </div>
  );
};

export default StationSearch;
