import fetch from "node-fetch";
import * as process from "process";


// (async () => {
//     console.log("process.env.GLOBAL_AGENT_HTTP_PROXY",  process.env.GLOBAL_AGENT_HTTP_PROXY)
//
//     const res = await fetch("https://api4.my-ip.io/ip.json")
//     const f = await res.json()
//     console.log(f)
// })()
export const getProposal = async (id: string): Promise<Proposal> => {
    try {

    const r = await fetch("https://hub.snapshot.org/graphql", {
        "headers": {
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,ka;q=0.6,id;q=0.5",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
        },
        "body": `{\"operationName\":\"Proposal\",\"variables\":{\"id\":\"${id}\"},\"query\":\"query Proposal($id: String!) {\\n  proposal(id: $id) {\\n    id\\n    ipfs\\n    title\\n    body\\n    discussion\\n    choices\\n    start\\n    end\\n    snapshot\\n    state\\n    author\\n    created\\n    plugins\\n    network\\n    type\\n    quorum\\n    symbol\\n    privacy\\n    validation {\\n      name\\n      params\\n    }\\n    strategies {\\n      name\\n      network\\n      params\\n    }\\n    space {\\n      id\\n      name\\n    }\\n    scores_state\\n    scores\\n    scores_by_strategy\\n    scores_total\\n    votes\\n    flagged\\n  }\\n}\"}`,
        "method": "POST"
    });
    const b: any = await r.json()
    return b.data.proposal as Proposal

    } catch (e) {
        throw new Error('getProposal' + JSON.stringify(e))
    }
}
export const getActiveProposals = async (space: string): Promise<string[]> => {

    try {
        const r = await fetch("https://hub.snapshot.org/graphql", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,ka;q=0.6,id;q=0.5",
                "content-type": "application/json",
                "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
            },
            "body": `{\"operationName\":\"Proposals\",\"variables\":{\"first\":100,\"state\":\"active\",\"space_in\":[\"${space}\"],\"start_gte\":1684056849},\"query\":\"query Proposals($first: Int!, $state: String!, $space_in: [String], $start_gte: Int) {\\n  proposals(\\n    first: $first\\n    where: {state: $state, space_in: $space_in, start_gte: $start_gte}\\n  ) {\\n    id\\n    title\\n    start\\n    end\\n    state\\n    space {\\n      id\\n      name\\n      avatar\\n    }\\n  }\\n}\"}`,
            "method": "POST"
        });

        const b: any = await r.json()
        return b.data.proposals.map(p => p.id) as string[]
    } catch (e) {
        throw new Error('getActiveProposals' + JSON.stringify(e))
    }

}

export interface Proposal {
    id: string
    choices: any[]

    type: string
    error?: Error
}



