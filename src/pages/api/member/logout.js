import jwt from 'jsonwebtoken';
import db from 'C:/Users/gc_de/next/my-app/DB/DB.js';
import secretKey from 'C:/Users/gc_de/next/my-app/secretkey/sercretkey';

const logout = async (req, res) => {
  try {
    const token = req.body.token;
    const verified = jwt.verify(token, secretKey);
    const memberID = verified.memberID;
    const queryString = "UPDATE member_table SET lastlogout = now() WHERE memberID = ?";
    
    // 비동기적으로 데이터베이스에서 조회 작업 수행
    db.query(queryString, [memberID]);
    res.json({ type:"logout", action:"님이 로그아웃했습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error', error);
  }
};

export default logout;
