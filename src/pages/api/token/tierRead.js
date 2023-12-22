import jwt from 'jsonwebtoken';
import secretKey from 'C:/Users/gc_de/next/my-app/secretkey/sercretkey';

const tierRead = async (req, res) => {
  try {
    const token = req.body.token;

    const verified = jwt.verify(token, secretKey);
    const tier = verified.tier
    // 토큰을 클라이언트로 전송
    res.json({ tier:tier });
        
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error', error);
  }
};

export default tierRead;
