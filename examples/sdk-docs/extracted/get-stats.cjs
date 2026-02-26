const { MailinatorClient, GetStatsRequest } = require('mailinator-client');

const client = new MailinatorClient('YOUR_API_TOKEN');

(async () => {
    const resp = await client.request(new GetStatsRequest());

    console.log(JSON.stringify(resp.result, null, 2));
})();