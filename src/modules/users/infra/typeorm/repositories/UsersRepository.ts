import { Repository } from 'typeorm';

import { AppDataSource } from '@database/data-source';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

export default class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(User);
    }

    public async find(): Promise<User[] | undefined> {
        return this.ormRepository.find();
    }

    public async findUserByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { email } });
        return user ?? undefined;
    }

    public async findUserById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { id } });
        return user ?? undefined;
    }

    public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create({ name, email, password });
        return this.ormRepository.save(user);
    }

    public async saveUser({ id, name, email, password, avatar }: User): Promise<User | undefined> {
        return this.ormRepository.save({ id, name, email, password, avatar });
    }

    public async delete(id: string): Promise<boolean | undefined> {
        const toRemove = await this.ormRepository.findOne({ where: { id } });

        if (!toRemove) {
            throw new Error(`User with id '${id}' not found.`);
        }

        await this.ormRepository.delete(id);
        return true;
    }
}
