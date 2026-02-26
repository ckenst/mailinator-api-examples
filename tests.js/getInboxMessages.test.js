import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MailinatorClient, GetInboxRequest, Sort } from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

test(`Get top 10 messages for inbox ${process.env.MAILINATOR_INBOX}`, async () => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    const domain = process.env.MAILINATOR_RESPONSE_DOMAIN;
    const inbox = process.env.MAILINATOR_INBOX;

    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');
    assert.ok(domain, 'MAILINATOR_RESPONSE_DOMAIN is not defined in .env');
    assert.ok(inbox, 'MAILINATOR_INBOX is not defined in .env');

    const client = new MailinatorClient(apiToken);

    const request = new GetInboxRequest(domain, inbox, 0, 10);
    // console.log(request);
    const resp = await client.request(request);
    // console.log(resp);

    assert.ok(resp, 'Response should not be null');
    assert.ok(resp.result, 'Response result should be present');
    assert.ok(Array.isArray(resp.result.msgs), 'msgs should be an array');
    assert.ok(resp.result.msgs.length <= 10, 'Should return no more than 10 messages');
});
