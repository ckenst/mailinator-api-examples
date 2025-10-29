const axios = require('axios');

function serializeHeaders(headers) {
  if (!headers) {
    return undefined;
  }

  if (typeof headers.toJSON === 'function') {
    return headers.toJSON();
  }

  return headers;
}

function resolveUri(instance, config) {
  if (typeof instance.getUri === 'function') {
    return instance.getUri(config);
  }

  return axios.getUri(config);
}

function enableAxiosDebugLogging(instance = axios, options = {}) {
  const { label = 'Axios request', enabled = true } = options;

  if (!enabled) {
    return () => {};
  }

  const interceptorId = instance.interceptors.request.use((config) => {
    const fullUrl = resolveUri(instance, config);
    const headers = serializeHeaders(config.headers);

    console.log(label, {
      method: config.method ? config.method.toUpperCase() : undefined,
      url: fullUrl,
      headers,
      data: config.data
    });

    return config;
  });

  return () => instance.interceptors.request.eject(interceptorId);
}

module.exports = {
  enableAxiosDebugLogging
};
