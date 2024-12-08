
export class SlidingWindowLog {
    maximumRequests: number;
    windowSize: number;
    timestamps: number[] = [];

    constructor(maximumRequests: number, windowSizeInSeconds: number) {
        this.maximumRequests = maximumRequests;
        this.windowSize = windowSizeInSeconds;
    }

    processRequests() {
        const now = new Date().getTime();
        this.removeOutdatedTimestamps(now);

        this.timestamps.push(now);

        if (this.timestamps.length > this.maximumRequests) {
          return false;
        }
        
        return true;
    }

    /**
     * Use binary search to find the lower bound on the start of the window
     * timestamps and remove all timestamps that are lower
     * @param now current time
     */
    private removeOutdatedTimestamps(now: number): void {
        // Move to the start of the window
        now -= this.windowSize*1000;

        let l = 0;
        let r = this.timestamps.length - 1;
        let idx = this.timestamps.length - 1;
        while(l <= r) {
            let mid = Math.floor(l + (r - l) / 2);
            if(this.timestamps[mid] >= now) {
                idx = mid;
                r = mid - 1;
            } else {
                l = mid + 1;
            }
        }

        this.timestamps = this.timestamps.slice(idx);
    }
}

const fixedWindow = new SlidingWindowLog(2, 1);
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
setInterval(() => console.log(fixedWindow.processRequests()), 500);

