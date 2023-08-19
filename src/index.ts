import 'global-agent/bootstrap.js';
import * as ethers from 'ethers';
import {Vote} from "@snapshot-labs/snapshot.js/dist/sign/types.js";
import {getActiveProposals, getProposal,} from "./proposal.js";
import {client} from "./client.js";

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";

dotenv.config();

let app: Express = express();
const port = process.env.PORT;
app.use( bodyParser());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));



app.post('/proposals/active', async (req: Request, res: Response) => {
    console.log('/proposals/active')
    const node = req.body.provider_rpc;
    const space = req.body.space
    const pk = req.body.pk

    try {
        const web3 = new ethers.providers.JsonRpcProvider(node);

        const wallet = new ethers.Wallet(pk, web3)
        const address = await wallet.getAddress();
        await client.follow(wallet, address, {
            space:space
        });

        const proposalIds = await getActiveProposals(space)

        const proposals = []
        for (const id of proposalIds) {
                const p = await getProposal(id)
                p.error = null
                proposals.push(p)

        }
        res.statusCode = 200
        res.send(JSON.stringify(proposals))
    } catch (e) {
        console.error(e)
        res.statusCode = 500
        res.send(JSON.stringify({error: JSON.stringify(e)}))
    }
});

app.post('/proposal/vote', async (req: Request, res: Response) => {
    console.log('/proposal/vote')
    const node = req.body.provider_rpc;
    const space = req.body.space
    const pk = req.body.pk
    const type = req.body.type
    const id = req.body.proposal_id

    try {
        const web3 = new ethers.providers.JsonRpcProvider(node);

        const wallet = new ethers.Wallet(pk, web3)
        const address = await wallet.getAddress();

        const vote: Vote = {
            type: type,
            proposal: id,
            choice: 1,
            space: space
        }
        await client.vote(wallet, address, vote).catch((err) => {
            throw new Error('vote error:' + JSON.stringify(err))
        })

        res.statusCode = 200
        res.send(JSON.stringify({}))
    } catch (e) {
        console.error(e)

        res.statusCode = 500
        res.send(JSON.stringify({error: e.message}))
    }
});

app.on('uncaughtException', parent => {
    console.error(parent)
})
app.on('error', parent => {
    console.error(parent)
})
app.on('listen', parent => {
    console.log(parent)
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});



