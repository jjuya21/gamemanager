import db from 'C:/Users/gc_de/next/my-app/DB/DB.js';

const updateEvents = async (req, res) => {
    try {
		// 데이터베이스 연결
        const id = req.body.id;
		const title = req.body.title;
		const s_time = req.body.s_time;
		const e_time = req.body.e_time;
		const reward = JSON.stringify(req.body.reward);
		const count = JSON.stringify(req.body.count);
        const point = JSON.stringify(req.body.point);

		const queryString = "UPDATE event_table SET title = ?, s_time = ?, e_time = ?, reward = ?, count = ? WHERE id = ?";
		// 'GET' 요청일 때 추가 작업 수행
		const result = await new Promise((resolve, reject) => {
			// 'usertable' 테이블의 데이터 조회
			db.query(queryString,[title,s_time,e_time,reward,count,id] ,(error, results) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(results);
			});
		});
		res.json({ type:"event" });
	} catch (error) {
		console.error(error);
		// 에러를 적절히 처리하세요 (응답 보내거나 재전파)
		res.status(500).send('Internal Server Error', error);
	}
};

export default updateEvents;
