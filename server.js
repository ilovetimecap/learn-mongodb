import express from "express";
import "dotenv/config";
import { MongoClient } from "mongodb";

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const app = express();

// JSON형태의 데이터를 객체로 변환
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Mongodb 객체 생성
const client = new MongoClient(MONGODB_URI);
const db = client.db(DB_NAME);
const collection = db.collection("users");

//데이터 읽기
app.get("/users", async (req, res) => {
  try {
    const users = await collection.find().toArray();
    console.log("users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.log(`fetch error:${error}`);
    res.status(500).json({
      message: "error fetching users",
      error: error.message,
    });
  }
});

//데이터 추가
app.post("/users", async (req, res) => {
  try {
    const { name, age, email } = req.body;
    console.log("name:", name);
    console.log("age:", age);
    console.log("email:", email);
  } catch (error) {
    console.log(`creating error:${error}`);
  }
});

//데이터 수정
app.put("/users/:id", async (req, res) => {
  try {
  } catch (error) {}
});

//데이터 삭제
app.delete("/users/:id", async (req, res) => {
  try {
  } catch (error) {}
});

//DB 연결
const connectDB = async () => {
  try {
    await client.connect();
    console.log("mongodb connected");
  } catch (error) {
    console.log(`🙌mongodb error: ${error}`);
  }
};

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 server running at ${PORT}`);
  connectDB();
});
