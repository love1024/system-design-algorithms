import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { MailRequest } from './model';
import { NotificationService } from './notifcationService';

const app: Application = express();
const notificationService = new NotificationService();

// parse application/json
app.use(bodyParser.json())

/**
 * Send notification API
 */
app.post('/v1/send/mail', async (req: Request, res: Response) => {
    const body = req.body as MailRequest;
    
    await notificationService.processMailRequest(body);

    res.send({ message: "Mail request added to the queue.", status: "OK"});
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server started at " + PORT)
})