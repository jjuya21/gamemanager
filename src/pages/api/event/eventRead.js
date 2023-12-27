import db from 'C:/Users/gc_de/next/my-app/DB/DB.js'

const getUsers = async (req, res) => {
	
	try {
		// 데이터베이스 연결
		const queryString = "SELECT id, type, title, DATE_FORMAT(s_time, '%Y.%m.%d %H:%i') as s_time, DATE_FORMAT(e_time, '%Y.%m.%d %H:%i') as e_time, reward, count FROM event_table";

		// 'GET' 요청일 때 추가 작업 수행
		const events = await new Promise((resolve, reject) => {
			// 'usertable' 테이블의 데이터 조회
			db.query(queryString, (error, results) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(results);
			});
		});
		const topics = [];
		for (let i = 0; events.length > i; i++){
			topics.push({ id: events[i].id, type: events[i].type, title: events[i].title, s_time: events[i].s_time, e_time: events[i].e_time, reward: JSON.parse(events[i].reward), count: JSON.parse(events[i].count) })
		}
		// 'GET' 요청에 대한 응답
		res.json({events:topics});
		
	} catch (error) {
		console.error(error);
		// 에러를 적절히 처리하세요 (응답 보내거나 재전파)
		res.status(500).send('Internal Server Error', error);
	} 
};

export default getUsers;

