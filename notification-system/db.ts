import { DATA } from "./data";


export class FakeDB {
    map = new Map<string, unknown>();

    constructor() {
        DATA.forEach((d) => {
            this.map.set(d.id, d.email);
        })
    }

    insert(key: string, value: string): void {
        this.map.set(key, value);
    }

    get(key): unknown {
        return this.map.get(key);
    }

    getAll(keys: string[]): unknown[] {
        const results: unknown[] = [];
        keys.forEach((k) => {
            results.push(this.map.get(k));
        })

        return results;
    }
}