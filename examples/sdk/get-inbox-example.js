import { MailinatorClient, GetInboxRequest, Sort } from 'mailinator-client';

const client = new MailinatorClient('YOUR_API_TOKEN');

const resp = await client.request(
  new GetInboxRequest('private', '*', /*skip*/0, 1, Sort.DESC, /*decodeSubject*/true)
);

// console.log('status', resp.statusCode);
// console.log('raw result', resp.result);
// console.log('headers', resp.headers);

if (resp.result) {
  console.log('inbox messages:', resp.result.msgs);
}