import { parseISO } from 'date-fns';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentsService from '../services/appointmentsService/CreateAppointmentsService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    const createAppointmentsService = new CreateAppointmentsService();

    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    return response.json(
        await createAppointmentsService.execute({
            provider_id,
            date: parsedDate,
        }),
    );
});

appointmentsRouter.get('/:id', async (request, response) => {
    const { id } = request.params;
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointment = await appointmentsRepository.findOne({
        where: { id },
    });

    const returnResponse = appointment || {
        message: `No appointment found.`,
        response: `id: ${id}`,
    };
    return response.json(returnResponse);
});

appointmentsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const removed = await appointmentsRepository.removeAppointment(id);

    const removedStatus = {
        message: `Successfully deleted: ${removed}`,
        response: `${removed}`,
    };
    return response.json(removedStatus);
});

export default appointmentsRouter;
