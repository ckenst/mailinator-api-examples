import { MailinatorClient, GetMessageRequest } from 'mailinator-client';

const client = new MailinatorClient('e066bc4e4e8b41aca529d6134dd317d9');

const resp = await client.request(new GetMessageRequest('private', 'chris-1770402139-09769941176'));
console.log(resp.result); // Message object