import React, { useEffect, useRef } from "react";
import TrainIcon from "./icon/TrainIcon";

interface UpcomingStation {
  name: string;
  arrivalTime: string;
  staying: boolean;
}

interface TrainPositionProps {
  upcomingStations: UpcomingStation[];
  lineColor: string;
}

const TrainPosition: React.FC<TrainPositionProps> = ({
  upcomingStations,
  lineColor,
}) => {
  // 누적 거리 계산
  const DISTANCE_SPACE = 100;
  const cumulativeDistances = upcomingStations.map((_, i) =>
    upcomingStations
      .slice(0, i + 1)
      .reduce((sum, s) => sum + DISTANCE_SPACE, -DISTANCE_SPACE),
  );
  const totalLength = cumulativeDistances.length || 1; // 0 방지

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [upcomingStations]);

  return (
    <div
      ref={ref}
      className={`${upcomingStations.length === 0 ? "hidden" : "block"} w-full overflow-x-auto`}
    >
      <div className="min-w-max flex justify-end">
        <svg
          width={totalLength * DISTANCE_SPACE + "px"}
          height="100"
          style={{ marginTop: "10px" }}
        >
          {/* 노선 선분 */}
          <line
            x1="50"
            y1="50"
            x2={totalLength * DISTANCE_SPACE - 50}
            y2="50"
            stroke={lineColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* 역 표시 */}
          {upcomingStations.map((station, i) => {
            const x = 50 + cumulativeDistances[i];
            return (
              <g key={i}>
                <circle cx={x} cy="50" r="8" fill={lineColor} />
                <text
                  x={x}
                  y="80"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#333"
                >
                  {station.name}
                </text>
                {station.staying && <TrainIcon color={lineColor} x={x - 20} />}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default TrainPosition;
