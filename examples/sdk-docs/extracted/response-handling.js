const { MailinatorClient, GetInboxRequest } = require('mailinator-client');

const client = new MailinatorClient('YOUR_API_TOKEN');

(async () => {
    const res = await client.request(new GetInboxRequest('domain', 'inbox'));
    if (res.statusCode >= 200 && res.statusCode < 300) {
        const inbox = res.result; // typed Inbox | undefined
        console.log(inbox);
    } else {
        console.error('Request failed', res.statusCode, res.result);
    }
})();
