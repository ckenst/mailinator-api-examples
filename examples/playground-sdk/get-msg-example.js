import { MailinatorClient, GetMessageRequest } from 'mailinator-client';

const client = new MailinatorClient('YOUR_API_TOKEN');

const resp = await client.request(new GetMessageRequest('private', 'message-id'));
console.log(resp.result); // Message object