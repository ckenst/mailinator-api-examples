const { MailinatorClient, GetMessageAttachmentRequest } = require('mailinator-client');
const fs = require('fs');

const client = new MailinatorClient('YOUR_API_TOKEN'); // --- IGNORE ---

(async () => {
    const resp = await client.request(new GetMessageAttachmentRequest('private', 'attachments-1769454272-0977344478', 0));
    if (resp.result) {
        // resp.result is an IncomingMessage (Node.js HTTP stream)
        resp.result.pipe(fs.createWriteStream('attachment.bin'));
    }
})();
