import db from 'C:/Users/gc_de/next/my-app/DB/DB.js';

const deleteUsers = async (req, res) => {
  try {
    const checkedIds = req.body.checkedIds;
    const deletedevent = [];
    // Promise.all을 사용하여 모든 삭제 작업이 완료될 때까지 기다리도록 수정
    await Promise.all(checkedIds.map(async (id) => {
      let queryString = "SELECT title FROM event_table WHERE id = " + id;

      // 비동기적으로 데이터베이스에서 삭제 작업 수행
      await new Promise((resolve, reject) => {
        db.query(queryString, (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results);
          deletedevent.push(results[0].title);
        });
      });
      queryString = "DELETE FROM event_table WHERE id = " + id;

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
    }));

    // 삭제 작업이 완료된 후에 응답 전송
    res.json({ type:"event", deletedevent:deletedevent });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error', error);
  }
};

export default deleteUsers;
