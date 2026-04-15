import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// __filename, __dirname 직접 만들어야 함
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const IP = process.env.IP || "0.0.0.0";
const SEOUL_API_KEY = process.env.SEOUL_METRO_API_KEY || "sample";
const SEOUL_API_URL = "http://swopenapi.seoul.go.kr/api/subway";

// API 응답 데이터를 프론트엔드 타입에 맞게 변환
const transformArrivalData = (item) => {
  return {
    beginRow: item.beginRow || null,
    endRow: item.endRow || null,
    curPage: item.curPage || null,
    pageRow: item.pageRow || null,
    totalCount: item.totalCount || 0,
    rowNum: item.rowNum || 0,
    selectedCount: item.selectedCount || 0,
    subwayId: item.subwayId,
    subwayName: item.subwayNm || null,
    upDownLine: item.updnLine,
    trainLineName: item.trainLineNm,
    subwayHeading: item.subwayHeading || null,
    stationFrontId: item.statnFid,
    stationTableId: item.statnTid,
    stationId: item.statnId,
    stationName: item.statnNm,
    trainCompany: item.trainCo || null,
    transitCount: item.trnsitCo,
    orderKey: item.ordkey,
    subwayList: item.subwayList,
    stationList: item.statnList,
    trainStatus: item.btrainSttus,
    arrivalTime: item.barvlDt,
    trainNumber: item.btrainNo,
    destinationStationId: item.bstatnId,
    destinationStationName: item.bstatnNm,
    receptionDateTime: item.recptnDt,
    arrivalMessageSecondary: item.arvlMsg2,
    arrivalMessageTertiary: item.arvlMsg3,
    arrivalCode: item.arvlCd,
    lastCarAt: item.lstcarAt,
  };
};

// Middleware
app.use(cors());
app.use(express.json());

// 서울 지하철 API에서 데이터 조회
const getMetroData = async (stationName) => {
  try {
    const url = `${SEOUL_API_URL}/${SEOUL_API_KEY}/json/realtimeStationArrival/0/30/${encodeURIComponent(stationName)}`;

    console.log("Requesting URL:", url);
    const response = await axios.get(url);
    const data = response.data;

    console.log("API Response:", JSON.stringify(data, null, 2));

    // API 응답 구조에 따라 데이터 변환
    if (
      data.realtimeArrivalList &&
      Array.isArray(data.realtimeArrivalList) &&
      data.realtimeArrivalList.length > 0
    ) {
      // 필드명 변환
      const transformedList = data.realtimeArrivalList.map((item) =>
        transformArrivalData(item),
      );

      return {
        status: 200,
        errorMessage: {
          status: 200,
          message: "success",
        },
        totalCount: data.errorMessage?.total || data.realtimeArrivalList.length,
        realtimeArrivalList: transformedList,
      };
    } else {
      console.log("Response structure issue - data:", data);
      return {
        status: 500,
        errorMessage: {
          status: 500,
          message: "No data found",
        },
        realtimeArrivalList: [],
      };
    }
  } catch (error) {
    console.error("API Error:", error.message);
    console.error("Error response:", error.response?.data);
    return {
      status: 500,
      errorMessage: {
        status: 500,
        message: error.message,
      },
      realtimeArrivalList: [],
    };
  }
};

// Routes
app.get("/metro/:stationName", async (req, res) => {
  const { stationName } = req.params;

  if (!stationName) {
    return res.status(400).json({
      status: 400,
      errorMessage: {
        status: 400,
        message: "Station name is required",
      },
    });
  }

  try {
    const data = await getMetroData(stationName);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      status: 500,
      errorMessage: {
        status: 500,
        message: "Internal server error",
      },
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 정적 파일 (프론트)
app.use(
  express.static(path.join(__dirname, "../dist"), {
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, path) => {
      if (path.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }),
);

//  SPA 라우팅 처리
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, IP, () => {
  console.log(`Metro API Server running on http://${IP}:${PORT}`);
});
