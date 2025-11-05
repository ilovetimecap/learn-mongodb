import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

// JSON형태의 데이터를 객체로 변환
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 server running at ${PORT}`);
});

