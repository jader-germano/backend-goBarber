import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import {inject, injectable} from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    name: string;

    email: string;

    password: string;
}
@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider) {

    }

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const checkUsersExists = await this.usersRepository.findUserByEmail(email
        );

        if (checkUsersExists) {
            throw new AppError('Email address already in use.');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);
        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await this.usersRepository.saveUser(user);

        return user;
    }
}
