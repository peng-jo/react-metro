import React, { useEffect, useState } from "react";
import data from "../data/lineInfo.json";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { resultType } from "../@type/resultType";

interface StationInfoProps {
  line: string;
  selectedStation: string;
  result: resultType[];
  loading: boolean;
  refreshTime: Date;
  refreshData: () => void;
}

const StationInfo: React.FC<StationInfoProps> = (props: StationInfoProps) => {
  const [result, setResult] = useState<resultType[]>([]);
  const [addSec, setAddSec] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAddSec((addSec) => addSec + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [props.refreshTime]);

  const handleRefresh = () => {
    setAddSec(0);
    props.refreshData();
  };

  const calcDiffTime = (time: string): string => {
    const diffTime =
      props.refreshTime.getTime() + addSec * 1000 - new Date(time).getTime();
    const parsedSec = diffTime / 1000;

    let hour = 0;
    let min = 0;
    let sec = 0;

    if (parsedSec / 60 > 60) {
      hour = Math.floor(parsedSec / 60 / 60);
      min = Math.floor((parsedSec / 60) % 60);
      sec = Math.floor(((parsedSec / 60) % 60) % 60);

      return `${hour}시 ${min}분 ${sec}초`;
    }

    min = Math.floor(parsedSec / 60);
    sec = Math.floor(parsedSec % 60);

    return min > 0 ? `${min}분 ${sec}초` : `${sec}초`;
  };
  useEffect(() => {
    if (props.result !== undefined) {
      const result = props.result.filter((info) => {
        return (
          data.DATA.find((subway) => subway.SUBWAY_ID === info.subwayId)
            ?.SUBWAY_NAME === props.line
        );
      });
      if (result.length > 1 && result !== undefined) {
        setResult(result);
      }
    }
  }, [props.result, props.line]);

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 480 }} size="small" aria-label="info">
          <caption>
            출처: 서울 열린데이터 광장 ⓒ 2019. Seoul Metropolitan Government
            Some Rights Reserved.
          </caption>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} align="left">
                <div className="center">
                  <span>
                    {"데이터를 받은 시각 : "}
                    {props.refreshTime
                      ? props.refreshTime.toLocaleTimeString()
                      : "없음"}
                  </span>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    disabled={props.loading}
                    sx={{
                      color: "primary.main",
                      "&:disabled": {
                        color: "action.disabled",
                      },
                    }}
                  >
                    <RefreshIcon className={props.loading ? "rotate" : ""} />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">종착지하철역명</TableCell>
              <TableCell align="left">도착메세지</TableCell>
              <TableCell align="left">현재위치</TableCell>
              <TableCell align="left">시간차이</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result?.map((arrive, index) => (
              <TableRow
                key={arrive.bstatnNm + index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left">{arrive.bstatnNm}</TableCell>
                <TableCell align="left">
                  {arrive.barvlDt !== "0"
                    ? Math.floor(parseInt(arrive.barvlDt) / 60) +
                      " 분 " +
                      (parseInt(arrive.barvlDt) % 60) +
                      "초 후 도착 "
                    : arrive?.arvlMsg2}
                </TableCell>
                <TableCell align="left">{arrive.arvlMsg3}</TableCell>
                <TableCell align="left">
                  {calcDiffTime(arrive.recptnDt)}
                </TableCell>
              </TableRow>
            ))}
            {result.length < 1 && props.loading && (
              <TableRow>
                <TableCell colSpan={3} align="left">
                  <div className="loading-container">
                    <div className="loading"></div>
                    <div id="loading-text">loading</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {result.length < 1 && !props.loading && (
              <TableRow>
                <TableCell colSpan={3} align="left">
                  데이터가 없습니다. 운행 시간이 아니거나, API서버에서 지원하지
                  않는 노선입니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default StationInfo;
