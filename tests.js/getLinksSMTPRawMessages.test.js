test('Create a message with links', async () => {
    // inject a message with links in the body
    // one link that says subscribe with url
    // one link that says unsubscribe with url
    // assert the message was created successfully
    // save the message id
});

test('Get links for a message, from an inbox', async () => {
    // assert the links we injected are present in the response
});

test('Get links for a message, from a domain', async () => {
    // assert the links we injected are present in the response
});

test('Get link metadata for a message, from a domain', async () => {
    // assert that the text and url for each link is correct
});

test('Get smtp log for a message, from an inbox', async () => {
    // assert that the response includes the log, time, and event
});

test('Get smtp log for a message, from a domain', async () => {
    // assert that the response includes the log, time, and event
});

test('Get rfc 822 payload for a message, from an inbox', async () => {
    // assert that the response is just a rfc 822 payload as a 'data' property
});

test('Get rfc 822 payload for a message, from a domain', async () => {
    // assert that the response is just a rfc 822 payload as a 'data' property
});