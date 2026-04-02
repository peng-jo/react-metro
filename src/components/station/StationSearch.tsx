import { metroEngine } from "@/core/metroEngine";
import React, { useMemo, useState } from "react";

import { getChoseong } from "es-hangul";
import SpinIcon from "./icon/SpinIcon";

interface SearchProps {
  onChangeStaion: (value: string) => void;
  onRefreshLoading: () => void;
  loading: boolean;
  receiveTimeText: string;
  scrollStatus: string;
}

const StationSearch: React.FC<SearchProps> = ({
  onChangeStaion,
  onRefreshLoading,
  loading,
  receiveTimeText,
  scrollStatus,
}) => {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const filteredStations = useMemo(() => {
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

  function matchKorean(text: string, keyword: string) {
    if (!keyword) return true;

    const normalizedText = text.replace("역", "");
    const normalizedKeyword = keyword.replace("역", "");

    return (
      normalizedText.includes(normalizedKeyword) || // 일반 검색
      getChoseong(normalizedText).includes(normalizedKeyword) // 초성 검색
    );
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    setOpen(true);
  };

  const handleSelect = (station: any) => {
    setKeyword(station);
    setOpen(false);
  };

  function handleSearch() {
    onChangeStaion(keyword);
  }

  return (
    <div
      className={`sticky top-0 z-10 rounded-lg p-6 bg-white  ${scrollStatus != "DOWN" ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            value={keyword}
            onChange={handleChange}
            onFocus={() => {
              setOpen(true);
            }}
            type="text"
            placeholder="역명을 입력하세요 (예: 강남역)"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
          />

          {open && filteredStations.length > 0 && (
            <ul className="bg-white absolute z-10 w-full border rounded-lg mt-1 max-h-48 overflow-y-auto">
              {filteredStations.map((stations) => {
                const stationName = stations[0].station_name;
                return (
                  <li
                    key={stations[0]?.station_name}
                    className="px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-zinc-300"
                    onClick={() => handleSelect(stationName)}
                  >
                    {/* 역명 */}
                    <span>{stationName}</span>

                    <div className="flex gap-1">
                      {stations.map((line, idx) => (
                        <span
                          key={idx}
                          title={line.line_number}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: line.color }}
                        />
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-3 rounded-lg cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button
          onClick={() => onRefreshLoading()}
          className="bg-blue-500 text-white p-3 rounded-lg cursor-pointer"
        >
          <SpinIcon speed={"slow"} loading={loading} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default StationSearch;
