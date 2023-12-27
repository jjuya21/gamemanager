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

		let queryString = "UPDATE event_table SET title = ?, s_time = ?, e_time = ?, reward = ?, count = ? WHERE id = ?";
		await new Promise((resolve, reject) => {
			db.query(queryString,[title,s_time,e_time,reward,count,id] ,(error, results) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(results);
			})
		});

		queryString = "UPDATE point_table SET point = ?";
		
		await new Promise((resolve, reject) => {
			db.query(queryString,[point] ,(error, results) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(results);
			})
		});
		
		res.json({ type:"event", action:`님이 ${title} 이벤트의 내용을 변경했습니다.` });
	} catch (error) {
		console.error(error);
		// 에러를 적절히 처리하세요 (응답 보내거나 재전파)
		res.status(500).send('Internal Server Error', error);
	}
};

export default updateEvents;
