import jwt from 'jsonwebtoken';
import createApiResponse from '../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    const response = createApiResponse('error', null, null, 'Access denied');
    return res.status(401).json(response);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    next();
  } catch (error) {
    const response = createApiResponse('error', null, null, 'Invalid token');
    return res.status(401).json(response);
  }
}

export default verifyToken;
