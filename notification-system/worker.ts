import { redisConnection } from './redis';
import { Worker } from 'bullmq';
import pug from 'pug';

function doJob(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

export const startWorker = () => {
    const worker = new Worker(
        'mailer', 
        async job => {
          // Find notification template in the worker
          const template = pug.render('mailTemplate.pug', {
            body: job.data.body
          })

          // Send mail to using thirdy party systems
          console.log(`${job.id} started`)
          await doJob(5000);
        },
        { connection: redisConnection }
    )
    
    worker.on('error', () => {
        console.log("Worker error");
    })
    
    worker.on('ready', () => {
        console.log("Worker is ready");
    })
      
    worker.on('completed', job => {
        console.log(`${job.id} completed`)
    })
    
    worker.on('failed', job => {
        console.log(`${job?.id} failed`)
    })
}