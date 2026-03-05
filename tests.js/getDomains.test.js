import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const {
    MailinatorClient,
    GetDomainsRequest,
    GetRulesRequest,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client;
let rulesDomain;

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');

    rulesDomain = process.env.MAILINATOR_RULES_DOMAIN;
    assert.ok(rulesDomain, 'MAILINATOR_RULES_DOMAIN is not defined in .env');

    client = new MailinatorClient(apiToken);
});

test('Get a list of private domains', async () => {
    const resp = await client.request(new GetDomainsRequest());

    assert.ok(resp, 'Response should not be null');
    assert.ok(resp.result, 'Response result should be present');

    const serializedResult = JSON.stringify(resp.result).toLowerCase();
    assert.ok(
        serializedResult.includes(rulesDomain.toLowerCase()),
        `Expected private domain list to include ${rulesDomain}`,
    );
});

// TODO: Make sure this domain has 1 rule
test('Get a list of rules for a domain', async () => {
    const resp = await client.request(new GetRulesRequest(rulesDomain));

    assert.ok(resp, 'Response should not be null');
    assert.ok(resp.result, 'Response result should be present');
    assert.ok(Array.isArray(resp.result.rules), 'Expected rules to be an array');
    assert.equal(resp.result.rules.length, 0, `Expected exactly 0 rules for ${rulesDomain}`);
});