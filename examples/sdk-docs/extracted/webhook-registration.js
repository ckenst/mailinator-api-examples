const { MailinatorClient, PrivateInboxWebhookRequest } = require('mailinator-client');

// This endpoint is implemented as a tokenless request class; the whToken is embedded in URL
const webhook = {
    url: 'https://example.com/my-webhook',
    method: 'POST',
    enabled: true
};

const clientNoToken = new MailinatorClient();

(async () => {
    const resp = await clientNoToken.requestWithoutToken(
        new PrivateInboxWebhookRequest('myWebhookToken', 'inboxName', webhook)
    );
    console.log(resp.result);
})();
