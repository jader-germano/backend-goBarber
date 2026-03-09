import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { isEqual } from 'date-fns';
import { v4 as uuid } from 'uuid';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();
        Object.assign(appointment, { id: uuid(), provider_id, date });
        this.appointments.push(appointment);

        return appointment;
    }

    findAll(): Promise<Appointment[] | undefined> {
        return Promise.resolve(this.appointments);
    }

    public async findByDateAndProvider(
        provider_id: string,
        date: Date,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find((appointment) =>
            isEqual(appointment.date, date),
        );
        return findAppointment || undefined;
    }

    public async findById(id: string): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            (appointment) => appointment.id === id,
        );
        return findAppointment || undefined;
    }

    public async removeAppointment(id: string): Promise<boolean | undefined> {
        const index = this.appointments.findIndex((ap) => ap.id === id);
        this.appointments[index] = new Appointment();
        return !index;
    }
}

export default FakeAppointmentsRepository;
