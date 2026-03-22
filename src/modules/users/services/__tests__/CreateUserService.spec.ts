import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import CreateUsersService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUsersService(
            fakeUsersRepository,
            fakeHashProvider
        );

        const user = await createUser.execute({
            email: 'email@email.com',
            name: 'newUser',
            password: 'password'
        });
        expect(user).toHaveProperty('id');
        expect(user.name).toBe('newUser');
    });

    it('should not be able to create a new user with similar email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUsersService(
            fakeUsersRepository,
            fakeHashProvider

        );

        const user = await createUser.execute({
            email: 'johndoe@email.com',
            name: 'John Doe',
            password: '123456'
        });
        await expect(createUser.execute({
            email: 'johndoe@email.com',
            name: 'John Doe',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });

});
