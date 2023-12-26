import db from 'C:/Users/gc_de/next/my-app/DB/DB.js'

const createmembers = async (req, res) => {
	
	try {
		// 데이터베이스 연결
		const memberID = req.body.memberID;
		const password = req.body.password;
		const name = req.body.name;
		const phone = req.body.phone;

		let queryString = "SELECT * FROM member_table WHERE memberID = ?";
		let result = await new Promise((resolve, reject) => {
			// 'member_table' 테이블의 데이터 조회
			db.query(queryString, [memberID], (error, results) => {
			  if (error) {
				reject(error);
				return;
			  }
			  resolve(results);
			});
		});
		if (result.length > 0) {
			res.json({ error:"dip" })
		} else {
			queryString = "INSERT INTO member_table(id,name,memberID,password,phone,tier,joindate) VALUES((SELECT COALESCE(MAX(id), 0) + 1 FROM member_table ALIAS_FOR_SUBQUERY),?,?,?,?,'Viewer',now())";
			// 'GET' 요청일 때 추가 작업 수행
			result = await new Promise((resolve, reject) => {
				// 'membertable' 테이블의 데이터 조회
				db.query(queryString,[name,memberID,password,phone] ,(error, results) => {
					if (error) {
						reject(error);
						return;
					}
					resolve(results);
				});
			});
		}
		res.json({ type:"member", action:"님이 계정을 만들었습니다." });
	} catch (error) {
		console.error(error);
		// 에러를 적절히 처리하세요 (응답 보내거나 재전파)
		res.status(500).send('Internal Server Error', error);
	}
};

export default createmembers;

