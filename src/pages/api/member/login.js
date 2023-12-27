import jwt from 'jsonwebtoken';
import db from 'C:/Users/gc_de/next/my-app/DB/DB.js';
import secretKey from 'C:/Users/gc_de/next/my-app/secretkey/sercretkey';

const login = async (req, res) => {
  try {
    const memberID = req.body.memberID;
    const password = req.body.password;
    let queryString = "SELECT password, tier FROM member_table WHERE memberID = ?";
    
    // 비동기적으로 데이터베이스에서 조회 작업 수행
    const result = await new Promise((resolve, reject) => {
        db.query(queryString, [memberID], (error, results) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(results);
        });
    });

    if (result.length < 1) {
        res.json({ error: "wrong" });
    } else {
        if (result[0].password === password) {
          // JWT 토큰 생성
          const token = jwt.sign({ memberID, tier: result[0].tier }, secretKey, { expiresIn: '1m' });
          // 데이터베이스 업데이트
          queryString = "UPDATE member_table SET lastlogin = now() WHERE memberID = ?";
          db.query(queryString, [memberID]);

          res.json({ token:token, type:"login", action:"님이 로그인했습니다." });
        } else {
          res.json({ error: "wrong" });
        }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error', error);
  }
};

export default login;
