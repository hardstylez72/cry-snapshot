import snapshot from '@snapshot-labs/snapshot.js';
import * as ethers from "ethers";

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
export const client = new snapshot.Client712(hub);
