import 'core-js';
import 'zone.js/dist/zone';


if (process.env.APP_ENV === 'production') {
  // Production
} else {
  // Development and test
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
