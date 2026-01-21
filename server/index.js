import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SEOUL_API_KEY = process.env.SEOUL_METRO_API_KEY || "sample";
const SEOUL_API_URL = "http://swopenapi.seoul.go.kr/api/subway";

// Middleware
app.use(cors());
app.use(express.json());

// 서울 지하철 API에서 데이터 조회
const getMetroData = async (stationName) => {
  try {
    const url = `${SEOUL_API_URL}/${SEOUL_API_KEY}/json/realtimeStationArrival/1/5/${encodeURIComponent(stationName)}`;

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
      return {
        status: 200,
        errorMessage: {
          status: 200,
          message: "success",
        },
        totalCount: data.errorMessage?.total || data.realtimeArrivalList.length,
        realtimeArrivalList: data.realtimeArrivalList.map((row) => ({
          subwayId: row.subwayId,
          updnLine: row.updnLine,
          trainLineNm: row.trainLineNm,
          statnNm: row.statnNm,
          btrainSttus: row.btrainSttus,
          barvlDt: row.barvlDt,
          btrainNo: row.btrainNo,
          bstatnNm: row.bstatnNm,
          arvlMsg2: row.arvlMsg2,
          arvlMsg3: row.arvlMsg3,
          arvlCd: row.arvlCd,
          recptnDt: row.recptnDt,
          lstcarAt: row.lstcarAt,
        })),
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

app.listen(PORT, () => {
  console.log(`Metro API Server running on http://localhost:${PORT}`);
});
