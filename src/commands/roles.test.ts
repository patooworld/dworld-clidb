import { describe } from '@jest/globals';

import { testCliCommand } from '../test_utils.js';

describe('roles', () => {
  testCliCommand({
    name: 'list',
    args: ['roles', 'list', '--project.id', 'test', '--branch', 'test_branch'],
    expected: {
      snapshot: true,
    },
  });

  testCliCommand({
    name: 'create',
    args: [
      'roles',
      'create',
      '--project.id',
      'test',
      '--branch',
      'test_branch',
      '--role.name',
      'test_role',
    ],
    expected: {
      snapshot: true,
    },
  });

  testCliCommand({
    name: 'delete',
    args: [
      'roles',
      'delete',
      'test_role',
      '--project.id',
      'test',
      '--branch',
      'test_branch',
    ],
    expected: {
      snapshot: true,
    },
  });
});
