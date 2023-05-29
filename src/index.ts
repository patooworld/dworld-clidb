import * as yargs from 'yargs';
import { join } from 'node:path';
import { Api } from '@neondatabase/api-client';

import pkg from '../package.json';
import { ensureAuth } from './commands/auth';
import { defaultDir, ensureConfigDir } from './config';
import { log } from './log';
import { defaultClientID } from './auth';
import { isApiError } from './api';
import { fillInArgs } from './utils';

const builder = yargs
  .scriptName(pkg.name)
  .usage('usage: $0 <cmd> [args]')
  .help()
  .option('output', {
    describe: 'Set output format',
    type: 'string',
    choices: ['json', 'yaml', 'table'],
    default: 'table',
  })
  .option('api-host', {
    describe: 'The API host',
    default: 'https://console.neon.tech/api/v2',
  })
  // Setup config directory
  .option('config-dir', {
    describe: 'Path to config directory',
    type: 'string',
    default: defaultDir,
  })
  .middleware(ensureConfigDir)
  // Auth flow
  .option('oauth-host', {
    description: 'URL to Neon OAUTH host',
    default: 'https://oauth2.neon.tech',
  })
  .option('client-id', {
    description: 'OAuth client id',
    type: 'string',
    default: defaultClientID,
  })
  .option('api-key', {
    describe: 'API key',
    type: 'string',
    default: '',
  })
  .option('apiClient', {
    hidden: true,
    coerce: (v) => v as Api<unknown>,
    default: true,
  })
  .middleware((args) => fillInArgs(args), true)
  .middleware(ensureAuth)
  .commandDir(join(__dirname, './commands'))
  .fail(async (msg, err) => {
    if (isApiError(err)) {
      if (err.response.status === 401) {
        log.error('Authentication failed, please run `neonctl auth`');
      } else {
        log.error(
          '%d: %s\n%s',
          err.response.status,
          err.response.statusText,
          err.response.data?.message
        );
      }
    } else {
      log.error(msg || err.message);
    }
    process.exit(1);
  });

(async () => {
  const args = await builder.argv;
  if (args._.length === 0) {
    yargs.showHelp();
    process.exit(0);
  }
})();
