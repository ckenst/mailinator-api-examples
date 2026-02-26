const { MailinatorClient, GetMessageRequest } = require('mailinator-client');

const client = new MailinatorClient('YOUR_API_TOKEN');

(async () => {
    const resp = await client.request(new GetMessageRequest('private', 'chris-1770402139-09769941176'));
    console.log(resp.result); // Message object
})();
