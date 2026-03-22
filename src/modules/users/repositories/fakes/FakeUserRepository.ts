import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { uuid } from 'uuidv4';

export default class FakeUserRepository implements IUsersRepository {
    private users: User[] = [];

    public async find(): Promise<User[] | undefined> {
        return this.users;
    }

    public async findUserById(id: string): Promise<User | undefined> {
        const findUser = this.users.find((user) => user.id === id);
        return findUser;
    }

    public async findUserByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find((user) => user.email === email);
        console.log(this.users);

        console.log(findUser);

        return findUser;
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, data);

        this.users.push(user);

        console.log(this.users);

        return user;
    }

    public async saveUser(user: User): Promise<User | undefined> {
        const findIndex = this.users.findIndex((user) => user.id === user.id);
        this.users[findIndex] = user;

        return user;
    }

    public async delete(id: string): Promise<boolean | undefined> {
        const findIndex = this.users.findIndex((user) => user.id === user.id);
        this.users.slice(findIndex, 1);

        return !!findIndex;
    }
}
