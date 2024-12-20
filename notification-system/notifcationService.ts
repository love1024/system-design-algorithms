import { Queue } from "bullmq";
import { Cache } from "../cache/cache-lru";
import { FakeDB } from "./db";
import { MailRequest } from "./model";
import { redisConnection } from "./redis";
import { startWorker } from "./worker";


export class NotificationService {
    private cache = new Cache(100);
    private fakeDb = new FakeDB();
    // Create SMS Queue
    private smsQueue = new Queue('mailer', {
        connection: redisConnection
    })

    constructor() {
        // Start two worker
        startWorker();
        startWorker();
    }

    async processMailRequest(request: MailRequest): Promise<void> {
  
        const data = {
            ...request
        }
    
        // Try cache first before DB
        const fromEmail = this.cache.get(request.from) as string | null;
        if(fromEmail) {
            data.from = fromEmail
        } else {
            data.from = this.fakeDb.get(request.from) as string 
            this.cache.put(request.from, fromEmail);
        }
        for(let i = 0; i < request.to.length; i++) {
            const key = request.to[i];
            const toMail = this.cache.get(key) as string | null;
            if(toMail) {
                data.to[i] = toMail
            } else {
                data.to[i] = this.fakeDb.get(key) as string
                this.cache.put(key, toMail);
            }
        }
    
        await this.smsQueue.add('mail', data)
    }
}