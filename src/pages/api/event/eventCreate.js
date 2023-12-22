import db from 'C:/Users/gc_de/next/my-app/DB/DB.js'

const createEvent = async (req, res) => {
	
	try {
		// 데이터베이스 연결
		const type = req.body.type;
		const title = req.body.title;
		const s_time = req.body.s_time;
		const e_time = req.body.e_time;
		const reward = JSON.stringify(req.body.reward);
		const count = JSON.stringify(req.body.count);

		console.log(req.body)

		const queryString = "INSERT INTO event_table(id, type, title, s_time, e_time, reward, count) VALUES((SELECT COALESCE(MAX(id), 0) + 1 FROM event_table ALIAS_FOR_SUBQUERY),?,?,?,?,?,?)";
		// 'GET' 요청일 때 추가 작업 수행
		const result = await new Promise((resolve, reject) => {
			// 'usertable' 테이블의 데이터 조회
			db.query(queryString,[type,title,s_time,e_time,reward,count] ,(error, results) => {
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

export default createEvent;

