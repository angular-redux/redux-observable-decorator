import 'core-js/es7/reflect';

const context = require.context('./spec', true, /\.spec\.ts/);
context.keys().map(context);
