export class Node {
    key: string;
    val: unknown;
    next: Node | null = null;
    prev: Node | null = null;
    constructor(key: string, val: unknown) {
        this.key = key;
        this.val = val;
    }
}

export class Cache {
    limit: number;
    map = new Map<string, Node>();
    head: Node;
    tail: Node;
    size = 0;

    constructor(limit: number) {
        this.limit = limit;
        // Dummy Nodes
        this.head = new Node('', 0);
        this.tail = new Node('', 0);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    put(key: string, val: unknown): void {
        let node = this.map.get(key) ?? new Node(key, val);

        // If already exists somewhere, delete from there.
        if(this.map.has(key)) {
            this.deleteFromCurrentPosition(node);
        } else {
            this.map.set(key, node);
            this.size++;
        }

        // Add it at the end
        this.addToEnd(node);

        // Remove from the start, if size is exceeded
        if(this.size > this.limit && this.head.next) {
            this.map.delete(this.head.next.key);
            const next = this.head.next.next;
            if(next) {
                this.head.next = next;
                next.prev = this.head;
                this.size--;
            }
        }

        this.print();
    }

    get(key: string): unknown {
        const node = this.map.get(key);
        if(!node) {
            console.warn(`${key} is not found.`);
            return null;
        }

        // Delete it from the current position
        this.deleteFromCurrentPosition(node);

        // Add it at the end
        this.addToEnd(node);

        this.print();
        return node.val;
    }

    print(): void {
        let temp: Node | null= this.head?.next;
        let str = '';
        while(temp !== this.tail) {
            str += `${temp?.key}:${temp?.val}` + ' ';
            temp = temp?.next ?? null;
        }

        console.log(str.trim());
    }

    private deleteFromCurrentPosition(node: Node) {
        const prev = node?.prev;
        const next = node?.next;
        if(prev && next) {
            prev.next = next;
            next.prev = prev;
        }
    }

    private addToEnd(node: Node) {
        const end = this.tail.prev;
        if(end !== null) {
            end.next = node;
            node.prev = end;
            node.next = this.tail;
            this.tail.prev = node;
        }
    }
}

const cache = new Cache(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
console.log(cache.get('a'));
cache.put('d', 4);
console.log(cache.get('b'));