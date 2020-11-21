import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getRepository, Repository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, date });

        return this.ormRepository.save(appointment);
    }

    public async findById(id: string): Promise<Appointment | undefined> {
        const appointment = await this.ormRepository.findOne({
            where: { id },
        });
        return appointment;

    }

    public async findByDateAndProvider(
        provider_id: string,
        date: Date,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });

        return findAppointment || undefined;
    }

    public async findAll(): Promise<Appointment[] | undefined> {
        const findAppointment = await this.ormRepository.find();

        return findAppointment || null;
    }

    public async removeAppointment(id: string): Promise<boolean> {
        const toRemove = await this.ormRepository.findOne({
            where: { id },
        });

        if (toRemove === null) {
            throw new AppError(`Appointments with id '${id}' not found.`);
        }

        await this.ormRepository.delete(id);

        return true;
    }
}

export default AppointmentsRepository;
