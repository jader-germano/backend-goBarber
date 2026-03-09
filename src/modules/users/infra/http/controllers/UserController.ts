import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import SearchUserService from '@modules/users/services/SearchUserService';
import UpdateAvatarUserService from '@modules/users/services/UpdateUserAvatarService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserController {

    public async save(request: Request, response: Response) {
        const createUsersService = container.resolve(CreateUserService);

        const { name, email, password } = request.body;

        return response.json(
            await createUsersService.execute({ name, email, password }),
        );
    }

    public async search(request: Request, response: Response) {
        const id = request.params.id as string;
        const searchUserService = container.resolve(SearchUserService);
        const user = await searchUserService.search(id);

        const returnResponse = user || {
            message: `No user found.`,
            response: `id: ${id}`,
        };

        return response.json(returnResponse);
    }

    public async searchAll(request: Request, response: Response) {
        const searchUserService = container.resolve(SearchUserService);
        const users = await searchUserService.searchAll();
        return response.json(users);
    }

    public async updateAvatar(request: Request, response: Response) {
        const updateAvatarUserService = container.resolve(
            UpdateAvatarUserService,
        );

        if (!request.file) {
            return response.status(400).json({ error: 'File is required.' });
        }

        const users = await updateAvatarUserService.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });
        return response.json(users);
    }

    public async delete(request: Request, response: Response) {
        const id = request.params.id as string;
        const deleteUserService = container.resolve(DeleteUserService);
        const deleted = await deleteUserService.delete(id);

        const removedStatus = {
            message: `Successfully deleted: ${deleted}`,
            response: `${deleted}`,
        };
        return response.json(removedStatus);
    }
}
