export class FixedWindowCounter {
  maximumRequests: number; // Maximum requests allowed in the current window
  windowSize: number; // current window size in seconds
  windowStart = new Date().getTime(); // start of the window
  counter = 0; // current requests counter in the window

  constructor(maximumRequests: number, windowSizeInSeconds: number) {
    this.maximumRequests = maximumRequests;
    this.windowSize = windowSizeInSeconds;
  }

  processRequests(requests = 1) {
    this.updateWindowCounter(requests);
    if (this.counter > this.maximumRequests) {
      return false;
    }

    return true;
  }

  private updateWindowCounter(requests: number): void {
    const now = new Date().getTime();
    // Calculate window end, and see if the current request lies within the window or after that
    const windowEnd = this.windowStart + 1000 * this.windowSize;
    if (now < windowEnd) {
      this.counter += requests;
    } else {
      this.windowStart = now;
      this.counter = 0;
    }
  }
}

const fixedWindow = new FixedWindowCounter(2, 1);
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
console.log(fixedWindow.processRequests());
setInterval(() => console.log(fixedWindow.processRequests()), 300);
