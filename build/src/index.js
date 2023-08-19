var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'global-agent/bootstrap.js';
import * as ethers from 'ethers';
import { getActiveProposals, getProposal, } from "./proposal.js";
import { client } from "./client.js";
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
dotenv.config();
let app = express();
const port = process.env.PORT;
app.use(bodyParser()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.post('/proposals/active', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('/proposals/active');
    const node = req.body.provider_rpc;
    const space = req.body.space;
    const pk = req.body.pk;
    try {
        const web3 = new ethers.providers.JsonRpcProvider(node);
        const wallet = new ethers.Wallet(pk, web3);
        const address = yield wallet.getAddress();
        yield client.follow(wallet, address, {
            space: space
        });
        const proposalIds = yield getActiveProposals(space);
        const proposals = [];
        for (const id of proposalIds) {
            const p = yield getProposal(id);
            p.error = null;
            proposals.push(p);
        }
        res.statusCode = 200;
        res.send(JSON.stringify(proposals));
    }
    catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.send(JSON.stringify({ error: JSON.stringify(e) }));
    }
}));
app.post('/proposal/vote', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('/proposal/vote');
    const node = req.body.provider_rpc;
    const space = req.body.space;
    const pk = req.body.pk;
    const type = req.body.type;
    const id = req.body.proposal_id;
    try {
        const web3 = new ethers.providers.JsonRpcProvider(node);
        const wallet = new ethers.Wallet(pk, web3);
        const address = yield wallet.getAddress();
        const vote = {
            type: type,
            proposal: id,
            choice: 1,
            space: space
        };
        yield client.vote(wallet, address, vote).catch((err) => {
            throw new Error('vote error:' + JSON.stringify(err));
        });
        res.statusCode = 200;
        res.send(JSON.stringify({}));
    }
    catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.send(JSON.stringify({ error: e.message }));
    }
}));
app.on('uncaughtException', parent => {
    console.error(parent);
});
app.on('error', parent => {
    console.error(parent);
});
app.on('listen', parent => {
    console.log(parent);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map