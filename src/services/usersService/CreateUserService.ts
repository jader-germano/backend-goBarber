import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import AppError from '../../errors/AppError';
import User from '../../models/User';

interface Request {
    name: string;
    email: string;
    password: string;
}

export default class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);
        const checkUsersExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUsersExists) {
            throw new AppError('Email address already in use.');
        }
        const hashedPassword = await hash(password, 8);
        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        await usersRepository.save(user);
        delete user.password;
        return user;
    }
}
