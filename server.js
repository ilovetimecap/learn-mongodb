import express from "express";
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

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
    // DB에 데이터 추가
    const result = await collection.insertOne({
      name,
      age,
      email,
      createAt: new Date(),
    });
    //응답
    res.status(201).json(result);
  } catch (error) {
    console.log(`error creating users:${error}`);
    res.status(500).json({
      message: "error creating users",
      error: error.message,
    });
  }
});

//데이터 수정
app.put("/users/:id", async (req, res) => {
  try {
    // DB에 데이터 수정
    const { id } = req.params; //string type
    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { ...req.body, updatedAt: new Date() },
      }
    );
    console.log("🚀 ~ result:", result);
    //수정된 문서가 있는 경우 응답
    result.modifiedCount
      ? res.status(200).json(result)
      : res.status(404).json({ message: "User not found or no change made" });
  } catch (error) {
    console.log(`error updating user:${error}`);
    res.status(500).json({
      message: "error updating users",
      error: error.message,
    });
  }
});

//데이터 삭제
app.delete("/users/:id", async (req, res) => {
  try {
    //DB에서 데이터 삭제
    const { id } = req.params;

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    //응답
    result.deletedCount
      ? res.status(200).json({
          message: "User deleted",
          id,
        })
      : res.status(400).json({
          message: "Not Found",
        });
  } catch (error) {
    console.log(`error deleting user:${error}`);
    res.status(500).json({
      message: "error deleting users",
      error: error.message,
    });
  }
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
