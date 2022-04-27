import React from "react";
import data from "../data/lineInfo.json";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {resultType} from "../@type/resultType";

interface StationInfoProps {
  line: string;
  selectedStation: string;
  result: {realtimeArrivalList:[resultType]} | undefined;
}


// http://swopenapi.seoul.go.kr/api/subway/sample/json/realtimeStationArrival/0/5/%EA%B3%A0%EC%9E%94
// const result = {
//   errorMessage: {
//     status: 200,
//     code: "INFO-000",
//     message: "정상 처리되었습니다.",
//     link: "",
//     developerMessage: "",
//     total: 8,
//   },
//   realtimeArrivalList: [
//     {
//       beginRow: null,
//       endRow: null,
//       curPage: null,
//       pageRow: null,
//       totalCount: 8,
//       rowNum: 1,
//       selectedCount: 5,
//       subwayId: "1004",
//       subwayNm: null,
//       updnLine: "상행",
//       trainLineNm: "당고개행 - 중앙방면",
//       subwayHeading: "오른쪽",
//       statnFid: "1004000452",
//       statnTid: "1004000450",
//       statnId: "1004000451",
//       statnNm: "고잔",
//       trainCo: null,
//       ordkey: "01001당고개0",
//       subwayList: "1004",
//       statnList: "1004000451",
//       btrainSttus: null,
//       barvlDt: "0",
//       btrainNo: "4622",
//       bstatnId: "0",
//       bstatnNm: "당고개",
//       recptnDt: "2022-04-25 15:06:28.0",
//       arvlMsg2: "전역 진입",
//       arvlMsg3: "초지",
//       arvlCd: "4",
//     },
//     {
//       beginRow: null,
//       endRow: null,
//       curPage: null,
//       pageRow: null,
//       totalCount: 8,
//       rowNum: 2,
//       selectedCount: 5,
//       subwayId: "1075",
//       subwayNm: null,
//       updnLine: "상행",
//       trainLineNm: "왕십리행 - 중앙방면",
//       subwayHeading: "오른쪽",
//       statnFid: "1075075254",
//       statnTid: "1075075252",
//       statnId: "1075075253",
//       statnNm: "고잔",
//       trainCo: null,
//       ordkey: "01003왕십리0",
//       subwayList: "1004,1075",
//       statnList: "1075075253",
//       btrainSttus: null,
//       barvlDt: "0",
//       btrainNo: "6574",
//       bstatnId: "165",
//       bstatnNm: "왕십리",
//       recptnDt: "2022-04-25 15:05:46.0",
//       arvlMsg2: "[3]번째 전역 (신길온천)",
//       arvlMsg3: "신길온천",
//       arvlCd: "99",
//     },
//     {
//       beginRow: null,
//       endRow: null,
//       curPage: null,
//       pageRow: null,
//       totalCount: 8,
//       rowNum: 3,
//       selectedCount: 5,
//       subwayId: "1004",
//       subwayNm: null,
//       updnLine: "상행",
//       trainLineNm: "당고개행 - 중앙방면",
//       subwayHeading: "오른쪽",
//       statnFid: "1004000452",
//       statnTid: "1004000450",
//       statnId: "1004000451",
//       statnNm: "고잔",
//       trainCo: null,
//       ordkey: "02005당고개0",
//       subwayList: "1004",
//       statnList: "1004000451",
//       btrainSttus: null,
//       barvlDt: "0",
//       btrainNo: "4624",
//       bstatnId: "0",
//       bstatnNm: "당고개",
//       recptnDt: "2022-04-25 15:06:28.0",
//       arvlMsg2: "[5]번째 전역 (오이도)",
//       arvlMsg3: "오이도",
//       arvlCd: "99",
//     },
//     {
//       beginRow: null,
//       endRow: null,
//       curPage: null,
//       pageRow: null,
//       totalCount: 8,
//       rowNum: 4,
//       selectedCount: 5,
//       subwayId: "1075",
//       subwayNm: null,
//       updnLine: "상행",
//       trainLineNm: "왕십리행 - 중앙방면",
//       subwayHeading: "오른쪽",
//       statnFid: "1075075254",
//       statnTid: "1075075252",
//       statnId: "1075075253",
//       statnNm: "고잔",
//       trainCo: null,
//       ordkey: "02015왕십리0",
//       subwayList: "1004,1075",
//       statnList: "1075075253",
//       btrainSttus: null,
//       barvlDt: "0",
//       btrainNo: "6578",
//       bstatnId: "165",
//       bstatnNm: "왕십리",
//       recptnDt: "2022-04-25 15:05:46.0",
//       arvlMsg2: "[15]번째 전역 (인하대)",
//       arvlMsg3: "인하대",
//       arvlCd: "99",
//     },
//     {
//       beginRow: null,
//       endRow: null,
//       curPage: null,
//       pageRow: null,
//       totalCount: 8,
//       rowNum: 5,
//       selectedCount: 5,
//       subwayId: "1004",
//       subwayNm: null,
//       updnLine: "하행",
//       trainLineNm: "오이도행 - 초지방면",
//       subwayHeading: "왼쪽",
//       statnFid: "1004000450",
//       statnTid: "1004000452",
//       statnId: "1004000451",
//       statnNm: "고잔",
//       trainCo: null,
//       ordkey: "11003오이도0",
//       subwayList: "1004",
//       statnList: "1004000451",
//       btrainSttus: null,
//       barvlDt: "0",
//       btrainNo: "4607",
//       bstatnId: "53",
//       bstatnNm: "오이도",
//       recptnDt: "2022-04-25 15:06:33.0",
//       arvlMsg2: "[3]번째 전역 (상록수)",
//       arvlMsg3: "상록수",
//       arvlCd: "99",
//     },
//   ],
// };
const StationInfo:React.FC<StationInfoProps> = (props: StationInfoProps) => {
   
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
                <TableCell align="left">종착지하철역명</TableCell>
                <TableCell align="left">도착메세지</TableCell>
                <TableCell align="left">현재위치</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                props.result !== undefined &&
                props.result.realtimeArrivalList
                  .filter((info) => {
                    // console.log(info.subwayId, props.line);
                    return (
                      data.DATA.find(
                        (subway) => subway.SUBWAY_ID === info.subwayId
                      )?.SUBWAY_NAME === props.line
                    );
                  })
                  .map((arrive, index) => (
                    <TableRow
                      key={arrive.bstatnNm + index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">{arrive.bstatnNm}</TableCell>
                      <TableCell align="left">{arrive.arvlMsg2}</TableCell>
                      <TableCell align="left">{arrive.arvlMsg3}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
}

export default StationInfo;