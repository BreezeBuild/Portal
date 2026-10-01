'use strict';

exports.config = {
  app_name: ['BreezeBuild Web'],
  attributes: {
    exclude: ['request.headers.authorization', 'request.headers.cookie', 'request.headers.set-cookie*'],
  },
  opentelemetry: {
    enabled: true,
  },
  instrumentation: {
    http: { enabled: false },
    next: { enabled: false },
    undici: { enabled: false },
  },
};
