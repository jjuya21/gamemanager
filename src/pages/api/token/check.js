import jwt from 'jsonwebtoken';
import secretKey from 'C:/Users/gc_de/next/my-app/secretkey/sercretkey';

const tokenCheck = async (req, res) => {
    const token = req.body.token;

    try {
      const verified = jwt.verify(token, secretKey);
      const tier = verified.tier;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // 토큰 만료 에러 처리
        res.json({ expired: true });
      } else {
        res.json({ expired: false });
      }
    }
};

export default tokenCheck;
