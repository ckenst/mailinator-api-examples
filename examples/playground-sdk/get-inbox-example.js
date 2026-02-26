import { MailinatorClient, GetInboxRequest, Sort } from 'mailinator-client';

const client = new MailinatorClient('e066bc4e4e8b41aca529d6134dd317d9');

const resp = await client.request(
  new GetInboxRequest('private', 'chris', /*skip*/0, 5, Sort.DESC, /*decodeSubject*/true)
);

// console.log('status', resp.statusCode);
// console.log('raw result', resp.result);
// console.log('headers', resp.headers);

if (resp.result) {
  console.log('inbox messages:', resp.result.msgs);
}