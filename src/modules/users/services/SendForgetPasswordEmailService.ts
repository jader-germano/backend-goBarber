import { inject, injectable } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    email: string;
}

@injectable()
export default class SendForgetPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findUserByEmail(email);

        if (!user) throw new AppError('User doesnt exists.');

        await this.userTokenRepository.generate(user.id);
        await this.mailProvider.sendMail(
            email,
            'Pedido de recuperação de senha reebido.',
        );
    }
}
