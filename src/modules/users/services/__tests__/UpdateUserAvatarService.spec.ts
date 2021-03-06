
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '../UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able change user avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndow@email.com',
            password: '12345'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndow@email.com',
            password: '12345'
        });


        expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFileName: 'avatar.jpg',
            })

        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when upadating new avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndow@email.com',
            password: '12345'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });


        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');


        expect(user.avatar).toBe('avatar2.jpg');
    });


});
