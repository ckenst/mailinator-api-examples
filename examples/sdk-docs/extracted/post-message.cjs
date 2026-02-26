const { MailinatorClient, PostMessageRequest } = require('mailinator-client');

const client = new MailinatorClient('YOUR_API_TOKEN');

const msg = {
    from: 'sender@example.com',
    subject: 'Hello',
    parts: [{ type: 'text/plain', body: 'Hello world' }]
};

(async () => {
    const resp = await client.request(new PostMessageRequest('private', 'inject', msg));
    console.log(resp.result); // PostedMessage info
})();
