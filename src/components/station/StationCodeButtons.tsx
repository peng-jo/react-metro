import React from "react";
import { metroEngine } from "@/core/metroEngine";

interface StationCodeButtonsProps {
  selectedCodes: string[];
  selectedCode: string;
  onSelectCode: (code: string) => void;
}

const StationCodeButtons: React.FC<StationCodeButtonsProps> = ({
  selectedCodes,
  selectedCode,
  onSelectCode,
}) => {
  return (
    <div className="flex py-3 md:py-6">
      {selectedCodes.map((code) => {
        const stationInfo = metroEngine.getStationInfoByCode(code);
        const { color = "#2B7FFF", station_code: stationCode } =
          stationInfo ?? {};

        return (
          <button
            key={code}
            onClick={() => onSelectCode(code)}
            className={`
              px-2 py-1 sm:px-3 sm:py-2 mr-2
              rounded-lg flex items-center justify-center
              text-white text-xs sm:text-sm font-bold
              cursor-pointer select-none
              transition-all active:scale-95
              ${selectedCode === code ? "scale-110" : "scale-100"}
            `}
            style={{ backgroundColor: color }}
          >
            {stationCode}
          </button>
        );
      })}
    </div>
  );
};

export default StationCodeButtons;
