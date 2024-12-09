import {
    AvlTree
  } from '@datastructures-js/binary-search-tree';
import { createHash } from 'crypto';



export class ConsistentHashing {
    tree = new AvlTree<number>();
    vNodes: number;
    nodeMap = new Map<number, string>();
    
    /**
     * Initialize 
     * @param vNodes Number of virtual nodes for each node
     * @param servers Servers to initialize
     */
    constructor(vNodes = 40, servers: string[] = []) {
        this.vNodes = vNodes;

        for(let server of servers) {
            this.addNode(server);
        }
    }

    addNode(node: string): void {
        const hash = this.generateHash(node);

        const virtualNodes: number[] = [];
        for(let i = 0; i < this.vNodes; i++) {
            const vNodeKey = `${node}#${i}`;
            const hash = this.generateHash(vNodeKey);
            virtualNodes.push(hash);
            this.tree.insert(hash);
            this.nodeMap.set(hash, node);
        }
    }

    getNode(key: string): string {
        const hash = this.generateHash(key);
        const successor = this.tree.lowerBound(hash) ?? this.tree.min();
        if(successor === null) {
            throw new Error('Cannot map to any server');
        }
        const node = this.nodeMap.get(successor.getValue());
        return node ?? '';
    }


    private generateHash(key: string): number {
        // Resulting hash will be of 32 characters or 128bits
        const hash =  createHash('md5').update(key).digest('hex');
        // Reduce the hash space to 16^8 or 2^32
        return  parseInt(hash.slice(0, 8), 16);
    }
}

const ch = new ConsistentHashing();
ch.addNode('Server1');
ch.addNode('Server2');
ch.addNode('Server3');
ch.addNode('Server4');
console.log(ch.getNode('1'));
console.log(ch.getNode('2'));
console.log(ch.getNode('3'));
console.log(ch.getNode('4'));
console.log(ch.getNode('5'));
console.log(ch.getNode('6'));
console.log(ch.getNode('7'));
console.log(ch.getNode('8'));
console.log(ch.getNode('9'));
console.log(ch.getNode('10'));
