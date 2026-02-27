import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const {
    MailinatorClient,
    PostMessageRequest,
    MessageToPost,
    GetMessageAttachmentsRequest,
    GetMessageAttachmentRequest,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client;
let domain;
let inbox;
let createdMessageId;
let createdAttachmentName;
let createdAttachmentId;

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    domain = process.env.MAILINATOR_RULES_DOMAIN;

    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');
    assert.ok(domain, 'MAILINATOR_RULES_DOMAIN is not defined in .env');

    client = new MailinatorClient(apiToken);
    inbox = `auto-attachments-${Date.now()}`;
});

test('Create a message with attachments', async () => {
    const requestBody = Object.assign(
        new MessageToPost(
            `Attachment test ${Date.now()}`,
            'sender@example.com',
            'This message includes one attachment.',
        ),
        {
            parts: [
                {
                    headers: {
                        'content-type': 'text/plain; charset=utf-8',
                    },
                    body: 'This message includes one attachment.',
                },
                {
                    headers: {
                        'content-type': 'text/plain; charset=utf-8',
                        'content-disposition': 'attachment; filename="test-attachment.txt"',
                        'content-transfer-encoding': 'base64',
                    },
                    body: Buffer.from('attachment-content').toString('base64'),
                },
            ],
        },
    );

    const resp = await client.request(new PostMessageRequest(domain, inbox, requestBody));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result.id, 'Created message response should include id');

    createdMessageId = resp.result.id;
});

test('Get attachments for a message', async () => {
    assert.ok(createdMessageId, 'Message id should be set by create-message test');

    const resp = await client.request(new GetMessageAttachmentsRequest(domain, createdMessageId));

    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result, 'Response result should be present');
    assert.ok(resp.result.attachments.length > 0, 'Expected at least one attachment');

    const firstAttachment = resp.result.attachments[0];
    assert.ok(firstAttachment.filename, 'Attachment filename should be present');
    assert.ok(firstAttachment['attachment-id'] !== undefined, 'Attachment id should be present');

    createdAttachmentName = firstAttachment.filename;
    createdAttachmentId = String(firstAttachment['attachment-id']);
});

test('Download the attachment', async () => {
    assert.ok(createdMessageId, 'Message id should be set by create-message test');

    const resp = await client.request(
        new GetMessageAttachmentRequest(domain, createdMessageId, Number(createdAttachmentId)),
    );

    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result, 'Attachment response stream should be present');

    const chunks = [];
    for await (const chunk of resp.result) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const attachmentContent = Buffer.concat(chunks).toString('utf8');
    console.log('Fetched attachment content:', attachmentContent);
    assert.equal(
        attachmentContent,
        'attachment-content',
        'Downloaded attachment should match injected attachment content',
    );
});