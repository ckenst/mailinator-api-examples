import {
  MailinatorClient,
  GetInboxRequest
} from "mailinator-client";

const API_TOKEN = process.env.MAILINATOR_API_TOKEN;

async function getLatestEmailSummary(domain, inbox) {
  const client = new MailinatorClient(API_TOKEN);

  // Fetch inbox (returns message summaries)
  const inboxResponse = await client.request(
    new GetInboxRequest(domain, inbox)
  );

  const messages = inboxResponse.result?.msgs || [];

  // Mailinator returns newest first by default
  return messages[0] ?? null;
}

// Usage example
getLatestEmailSummary("private", "*")
  .then(msg => {
    console.log("Latest message summary:", msg);
    console.log("Done", msg?.id);
  });
