import db from 'C:/Users/gc_de/next/my-app/DB/DB.js';

const deleteMember = async (req, res) => {
  try {
    const checkedIds = req.body.checkedIds;
    const deletedID = [];
    // Promise.all을 사용하여 모든 삭제 작업이 완료될 때까지 기다리도록 수정
    await Promise.all(checkedIds.map(async (id) => {
      let queryString = "SELECT memberID, tier FROM member_table WHERE id = " + id;

      // 비동기적으로 데이터베이스에서 삭제 작업 수행
      const result = await new Promise((resolve, reject) => {
        db.query(queryString, (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results);
          deletedID.push(results[0].memberID);
        });
      });
      if (result[0].tier === "High") {
        res.json({ error:"no permission" })
      } else {
        queryString = "DELETE FROM member_table WHERE id = " + id;

        // 비동기적으로 데이터베이스에서 삭제 작업 수행
        await new Promise((resolve, reject) => {
          db.query(queryString, (error, results) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(results);
          });
        });
      };
    }));

    // 삭제 작업이 완료된 후에 응답 전송
    res.json({ type:"member", deletedID:deletedID });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error', error);
  }
};

export default deleteMember;
