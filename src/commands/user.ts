import yargs from 'yargs';
import { showHelpMiddleware } from '../help.js';

import { CommonProps } from '../types.js';
import { writer } from '../writer.js';

export const command = 'me';
export const describe = 'Show current user';
export const builder = (yargs: yargs.Argv) =>
  yargs.middleware(showHelpMiddleware(yargs, true));
export const handler = async (args: CommonProps) => {
  await me(args);
};

const me = async (props: CommonProps) => {
  const { data } = await props.apiClient.getCurrentUserInfo();
  writer(props).end(data, {
    fields: ['login', 'email', 'name', 'projects_limit'],
  });
};