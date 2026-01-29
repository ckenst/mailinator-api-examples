import { 
  MailinatorClient, 
  GetInboxRequest, 
  GetMessageRequest 
} from "mailinator-client";

const API_TOKEN = process.env.MAILINATOR_API_TOKEN;

// Use your actual API token
const client = new MailinatorClient({ authToken: API_TOKEN });

async function example() {
  const domain = "private";   // <-- your real private domain
  const inboxName = "inbox";               // the inbox you want to read

  try {
    // Fetch the inbox
    const inboxResp = await client.request(
      new GetInboxRequest(domain, inboxName)
    );

    if (!inboxResp.messages?.length) {
      console.log("No messages found in inbox:", inboxName);
      return;
    }

    const latest = inboxResp.messages[0];

    // Fetch the full message
    const messageResp = await client.request(
      new GetMessageRequest(domain, latest.id)
    );

    console.log("Subject:", messageResp.subject);
    console.log("From:", messageResp.from);
    console.log("Body:", messageResp.textBody);
  } catch (err) {
    console.error("API call failed:", err?.message || err);
  }
}

example();
