import db from 'C:/Users/gc_de/next/my-app/DB/DB.js'
import jwt from 'jsonwebtoken';
import secretKey from 'C:/Users/gc_de/next/my-app/secretkey/sercretkey';

const createLog = async (req, res) => {
	
	try {
		// 데이터베이스 연결
		const type = req.body.type;
		const token = req.body.token;
        const verified = jwt.verify(token, secretKey);
        const memberID = verified.memberID

		const queryString = "INSERT INTO log_table(time, memberID, type) VALUES(now(),?,?)";

        // 'usertable' 테이블의 데이터 조회
        db.query(queryString,[memberID,type]);
	} catch (error) {
		console.error(error);
		// 에러를 적절히 처리하세요 (응답 보내거나 재전파)
		res.status(500).send('Internal Server Error', error);
	}
};

export default createLog;

