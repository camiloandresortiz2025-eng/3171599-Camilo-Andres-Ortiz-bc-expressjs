import { Router } from 'express';
import * as controller from '../controllers/events.controller';

export const eventsRouter = Router();

eventsRouter.get('/',    controller.getAll);
eventsRouter.get('/:id', controller.getById);
eventsRouter.post('/',   controller.create);
eventsRouter.put('/:id', controller.update);
eventsRouter.delete('/:id', controller.remove);
