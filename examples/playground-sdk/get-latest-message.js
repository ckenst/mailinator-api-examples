import { 
  MailinatorClient, 
  GetInboxRequest, 
  GetInboxMessageRequest 
} from "mailinator-client";

const API_TOKEN = process.env.MAILINATOR_API_TOKEN;

async function getLatestEmail(domain, inbox) {
  const client = new MailinatorClient(API_TOKEN);
  const inboxResponse = await client.request(
        new GetInboxRequest(domain))
        const messages = inboxResponse.result?.msgs;
        const latestMsg = messages[0];
    const messageResponse = await client.request(
        new GetInboxMessageRequest(domain, inbox, latestMsg.id)
  );
  const message = messageResponse.result;
  console.log(message)
  return message;
}


// Example
getLatestEmail("private", "*");
