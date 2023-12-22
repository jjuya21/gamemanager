import db from 'C:/Users/gc_de/next/my-app/DB/DB.js'

const getLogs = async (req, res) => {
	
	try {
		// 데이터베이스 연결
		const queryString = "SELECT DATE_FORMAT(time, '%Y.%m.%d %H:%i') as time, memberID, type from log_table";

		// 'GET' 요청일 때 추가 작업 수행
		const logs = await new Promise((resolve, reject) => {
			// 'membertable' 테이블의 데이터 조회
			db.query(queryString, (error, results) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(results);
			});
		});
		// 'GET' 요청에 대한 응답
		res.json({ logs: logs });
		// 연결 종료
		
	} catch (error) {
		console.error(error);
		// 에러를 적절히 처리하세요 (응답 보내거나 재전파)
		res.status(500).send('Internal Server Error', error);
	}
};

export default getLogs;

