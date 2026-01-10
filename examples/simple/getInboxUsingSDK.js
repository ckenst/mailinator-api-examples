// This isn't using Mailinator's REST API directly, but instead uses the official Mailinator SDK for Node.js

// npm install mailinator-client
import MailinatorClient from "mailinator-client";

// Replace with your own API token (for private domain use) or if using public inbox ensure permissions allow
const API_TOKEN = process.env.MAILINATOR_API_TOKEN || "YOUR_API_TOKEN";

async function getLatestEmail(domain, inbox) {
  const client = new MailinatorClient({ authToken: API_TOKEN });

  // Step 1: Fetch inbox summaries (latest messages)
  const inboxResp = await client.messages.fetchInbox({
    domain: domain,
    inbox: inbox,
    limit: 5,
    sort: "descending"
  });

  const msgs = inboxResp.result?.msgs;
  if (!msgs || msgs.length === 0) {
    console.log("No messages in inbox", domain, inbox);
    return;
  }

  // Pick the latest message ID
  const latestMsg = msgs[0];
  console.log("Found message:", latestMsg.subject, latestMsg.id);

  // Step 2: Fetch the full message body
  const msgResp = await client.messages.fetchMessage({
    domain: domain,
    inbox: inbox,
    messageId: latestMsg.id
  });

  const message = msgResp.result;
  console.log("From:", message.from);
  console.log("Subject:", message.subject);
  console.log("Time:", new Date(message.time).toISOString());
  console.log("Text body:", message.textBody);
  console.log("HTML body:", message.htmlBody);

  return message;
}

// Usage example:
// For a public inbox (domain “public”) you might use domain = "public" and inbox = "your-inbox"
// For a private domain use your-team-domain.com as domain
getLatestEmail("public", "testinbox")
  .then(msg => {
    console.log("Done", msg?.id);
  })
  .catch(err => {
    console.error("Error retrieving email:", err);
  });