import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {

    find(): Promise<User[] | undefined>;

    findUserById(id: string): Promise<User | undefined>;

    findUserByEmail(email: string): Promise<User | undefined>;

    create(data: ICreateUserDTO): Promise<User>;

    saveUser(user: User): Promise<User | undefined>;

    delete(id: string): Promise<boolean | undefined>;
}
