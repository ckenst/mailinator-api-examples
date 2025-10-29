const path = require('path');

async function runTests() {
  const tests = [
    {
      name: 'fetchInboxMessages',
      run: require('./fetchInboxMessages.test').testFetchInboxMessages
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
    console.error('Ensure your Mailinator credentials are set in the environment or in', envPath);
    process.exit(1);
  }

  console.log('Endpoint smoke tests complete');
}

runTests();
