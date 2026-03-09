import { SignOptions } from 'jsonwebtoken';

interface IAuthConfig {
    jwt: {
        secret: string;
        expiresIn: SignOptions['expiresIn'];
    };
}

const authConfig: IAuthConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'gobarber_default_secret_change_in_prod',
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'],
    },
};

export default authConfig;
