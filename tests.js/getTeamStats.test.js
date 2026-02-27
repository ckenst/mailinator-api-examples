import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const { MailinatorClient, GetTeamRequest, GetStatsRequest } = mailinatorClient;
const require = createRequire(import.meta.url);
const { GetTeamInfoRequest } = require('mailinator-client/lib/stats/GetTeamInfoRequest'); // TODO: this is a bug, exposed in 1.0.9. Will be fixed in next release, but for now we can require it directly from the file until the fix is released.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client;
let teamConfig;
let emailReadsPerDay;
let num_private_domains;

before(async () => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    client = new MailinatorClient(apiToken);

    const teamResp = await client.request(new GetTeamRequest());
    assert.ok(teamResp, 'Team response should not be null');
    assert.ok(teamResp.result, 'Team response should include result');

    teamConfig = teamResp.result;
    emailReadsPerDay = teamConfig.plan_data?.email_reads_per_day;
    num_private_domains = teamConfig.plan_data?.num_private_domains;
});

test('Get team configuration', async () => {
    assert.equal(teamConfig.status, 'active', 'Team status should be active');
    
    assert.ok(teamConfig.sms_numbers.length > 0, 'At least one SMS number should be present');
    assert.ok(teamConfig.webhook_tokens.length > 0, 'At least one webhook token should be present');

    assert.ok(emailReadsPerDay = 10000, 'Email read limit is 10,000 per day');
});

test('Get team stats', async () => {
    const statsResp = await client.request(new GetStatsRequest());
    assert.ok(statsResp.result.stats.length > 0, 'stats should include at least one day');

    const latestStat = [...statsResp.result.stats].sort(
        (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
    )[0];

    const retrievedCounts = Object.values(latestStat.retrieved ?? {}).filter(
        (value) => typeof value === 'number',
    );
    const totalRetrievedToday = retrievedCounts.reduce((sum, value) => sum + value, 0);

    assert.ok(
        totalRetrievedToday <= emailReadsPerDay,
        `Expected total retrieved (${totalRetrievedToday}) to be <= email reads/day limit (${emailReadsPerDay})`,
    );
    console.log(`Total emails retrieved today: ${totalRetrievedToday}`);
});

test('Get team info snapshot', async () => {
    const teamInfoResp = await client.request(new GetTeamInfoRequest());

    assert.ok(teamInfoResp.result, 'Team info response should include result');
    assert.equal(teamInfoResp.result.domains.length, num_private_domains, `Team info snapshot should have ${num_private_domains} domains`);
    console.log(`Team's private domains: ${teamInfoResp.result.domains.length}`);
});