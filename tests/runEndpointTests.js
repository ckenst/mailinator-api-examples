const path = require('path');

async function runTests() {
  const inboxTests = require('./fetchInboxMessages.test');

  const tests = [
    {
      name: 'Fetching limited message summaries from a domain',
      run: inboxTests.testFetchInboxLimitedMessages,
    },
    {
      name: 'Fetching all message summaries from a domain',
      run: inboxTests.testFetchInboxAllMessages,
    },
    {
      name: 'Fetching full message from a specific inbox',
      run: inboxTests.testFetchSpecificInboxWithFullMessage,
    },
    {
      name: 'Fetching all message summaries for a specific inbox',
      run: inboxTests.testFetchSpecificInboxMessages,
    }
  ];

  let hasFailures = false;

  for (const test of tests) {
    try {
      await test.run();
      console.log(`✔ ${test.name}`);
    } catch (error) {
      console.error(`✘ ${test.name}`);
      console.error(error.message);
      hasFailures = true;
      break;
    }
  }

  if (hasFailures) {
    const envPath = path.resolve(__dirname, '..', '.env');
    process.exit(1);
  }

  console.log('Endpoint tests complete');
}

runTests();
