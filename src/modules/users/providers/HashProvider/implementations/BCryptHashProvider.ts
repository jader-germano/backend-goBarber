import { compare, hash } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';
import AppError from "@shared/errors/AppError";

class BCryptProvider implements IHashProvider {
	public async generateHash(payload: string): Promise<string> {
	    try {
	        return hash(payload, 8);
        } catch (e) {
            throw new AppError(`Invalid: ${e.message}`, 401);
        }
	}

	public async compareHash(payload: string, hashed: string): Promise<boolean> {
        try {
            return compare(payload, hashed);
        } catch (e) {
            throw new AppError(`Invalid: ${e.message}`, 401);
        }
	}
}

export default BCryptProvider;
