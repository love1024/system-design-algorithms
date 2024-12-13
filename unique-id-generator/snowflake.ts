export class Snowflake {
    private dataCeterId: number;
    private nodeId: number;
    private epoch: number;
    private sequence = 0;
    private lastTimestamp = -1; // Last millisecond timestamp
    constructor(dataCeterId: number, nodeId: number, epoch = 1672531200000) {
        // validate nodeId and dataCeterId to be not more than 5 bits
        if(nodeId < 0 || nodeId > 31) {
            throw new Error('NodeID must be between 0 and 31.')
        } else if(dataCeterId < 0 || dataCeterId > 31) {
            throw new Error('Data Center ID must be between 0 and 31.');
        }

        this.dataCeterId = dataCeterId;
        this.nodeId = nodeId;
        this.epoch = epoch;
    }

    generate(): bigint {
        let now = Date.now();
        if(now < this.lastTimestamp) {
            throw new Error('Clock moved backwards, Cannot generate new ID');
        }

        // If we generating multiple IDs in the same millisecond
        if(now === this.lastTimestamp) {
            // If we have generated more than 4096 Ids in a millisecond
            // Wait for the next millisecond
            this.sequence = (this.sequence + 1) % 4095;
            if(this.sequence === 0) {
               while(now <= this.lastTimestamp) {
                now = Date.now();
               } 
            }
        } else {
            // Reset sequence
            this.sequence = 0;
        }

        this.lastTimestamp = now;

        // construct a 64-Bit ID using BigInit as regular number can safely handle numbers till 53 bits only
        const id = (BigInt(now - this.epoch) << (64n - 41n)) | // 41 bits timestamp
        (BigInt(this.dataCeterId) << (64n - 41n - 5n)) | // 5 bits data center Id
        (BigInt(this.nodeId) << (64n - 41n - 10n)) |  // 5 bits machine ID
        (BigInt(this.sequence)); // 12 bits sequence

        return id;
    }
}

// const snowflake = new Snowflake(1, 1);
// for(let i = 0; i < 10; i++) {
//     console.log(snowflake.generate());
// }
