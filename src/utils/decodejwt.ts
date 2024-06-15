import jwt from 'jsonwebtoken';

export const decodeJWT = (token: string) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		return decoded;
	} catch (error) {
		return false
	}
};