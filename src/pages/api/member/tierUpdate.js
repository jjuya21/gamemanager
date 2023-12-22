import db from 'C:/Users/gc_de/next/my-app/DB/DB.js';

const updateTier = async (req, res) => {
    try {
		// 데이터베이스 연결
        const id = req.body.id;
        const tier = req.body.tier;

		const queryString = "UPDATE member_table SET tier = ? WHERE id = ?";
		// 'GET' 요청일 때 추가 작업 수행
		const result = await new Promise((resolve, reject) => {
			// 'usertable' 테이블의 데이터 조회
			db.query(queryString,[tier,id] ,(error, results) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(results);
			});
		});
		res.json({ type:"member" });
	} catch (error) {
		console.error(error);
		// 에러를 적절히 처리하세요 (응답 보내거나 재전파)
		res.status(500).send('Internal Server Error', error);
	}
};

export default updateTier;
