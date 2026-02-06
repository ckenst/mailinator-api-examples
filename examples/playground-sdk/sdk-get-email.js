import { 
  MailinatorClient, 
  GetInboxRequest, 
  GetInboxMessageRequest, 
  Sort 
} from "mailinator-client"; 

const API_TOKEN = process.env.MAILINATOR_API_TOKEN;

async function getLatestEmail(domain, inbox) {
  const client = new MailinatorClient(API_TOKEN);

  // what does this do?
  // It fetches the inbox messages for the specified domain and inbox, limiting to 5 messages sorted in descending order.
  const inboxResponse = await client.request(
    new GetInboxRequest(domain, inbox, undefined, 1, Sort.DESC)
  );

  // what does inboxResponse return
  // It returns an object containing the result with an array of messages (msgs) in the inbox.

  // what does messages return
  // It returns an array of message summaries in the inbox.
  const messages = inboxResponse.result?.msgs;

  // Get the latest message
  const latestMsg = messages[0];

  // Get the full message using the request-based SDK surface.
  const messageResponse = await client.request(
    new GetInboxMessageRequest(domain, inbox, latestMsg.id)
  );
  console.log(messageResponse)

  const message = messageResponse.result;
  console.log(message)

  return message;
}

// Usage example:
getLatestEmail("private", "*")
  .then(msg => {
    console.log("Done", msg?.id);
  });
