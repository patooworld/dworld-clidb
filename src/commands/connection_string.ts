import yargs from 'yargs';
import { EndpointScopeProps } from '../types';

export const command = 'connection-string';
export const aliases = ['cs'];
export const describe = 'Get connection string';
export const builder = (argv: yargs.Argv) => {
  return argv.usage('usage: $0 connection-string [options]').options({
    'project.id': {
      type: 'string',
      describe: 'Project ID',
      demandOption: true,
    },
    'endpoint.id': {
      type: 'string',
      describe: 'Endpoint ID',
      demandOption: true,
    },
    'role.name': {
      type: 'string',
      describe: 'Role name',
      demandOption: true,
    },
    'database.name': {
      type: 'string',
      describe: 'Database name',
      demandOption: true,
    },
    pooled: {
      type: 'boolean',
      describe: 'Use pooled connection',
      default: false,
    },
  });
};
export const handler = async (
  props: EndpointScopeProps & {
    role: { name: string };
    database: { name: string };
    pooled: boolean;
  }
) => {
  const {
    data: { endpoint },
  } = await props.apiClient.getProjectEndpoint(
    props.project.id,
    props.endpoint.id
  );

  const { data: password } = await props.apiClient.getProjectBranchRolePassword(
    props.project.id,
    endpoint.branch_id,
    props.role.name
  );

  const host = props.pooled
    ? endpoint.host.replace(endpoint.id, `${endpoint.id}-pooler`)
    : endpoint.host;
  const connectionString = new URL(`postgres://${host}`);
  connectionString.pathname = props.database.name;
  connectionString.username = props.role.name;
  connectionString.password = password.password;

  process.stdout.write(connectionString.toString());
};