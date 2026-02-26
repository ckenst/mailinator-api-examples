const { MailinatorClient, DeleteMessageRequest } = require('mailinator-client');

const client = new MailinatorClient('YOUR_API_TOKEN');

(async () => {
    const resp = await client.request(new DeleteMessageRequest('your-domain.com', 'inboxName', 'messageId'));
    console.log(resp.statusCode, resp.result);
})();
