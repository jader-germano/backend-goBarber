import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '../../shared/errors/AppError';

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
        }) as User;
        await usersRepository.save(user);
        delete user.password;
        return user;
    }
}
