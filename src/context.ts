import { accessSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { normalize, resolve } from 'node:path';
import yargs from 'yargs';

export type Context = {
  projectId?: string;
  branchId?: string;
};

const CONTEXT_FILE = '.neon';
const CHECK_FILES = [CONTEXT_FILE, 'package.json', '.git'];

const wrapWithContextFile = (dir: string) => resolve(dir, CONTEXT_FILE);

export const currentContextFile = () => {
  const cwd = process.cwd();
  let currentDir = cwd;
  const root = normalize('/');
  const home = homedir();
  while (currentDir !== root && currentDir !== home) {
    for (const file of CHECK_FILES) {
      try {
        accessSync(resolve(currentDir, file));
        return wrapWithContextFile(currentDir);
      } catch (e) {
        // ignore
      }
    }
    currentDir = resolve(currentDir, '..');
  }

  return wrapWithContextFile(cwd);
};

export const readContextFile = (file: string): Context => {
  try {
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch (e) {
    return {};
  }
};

export const enrichFromContext = (
  args: yargs.Arguments<{ contextFile: string }>
) => {
  if (args._[0] === 'set-context') {
    return;
  }
  const context = readContextFile(args.contextFile);
  if (!args.branch) {
    args.branch = context.branchId;
  }
  if (!args.projectId) {
    args.projectId = context.projectId;
  }
};

export const updateContextFile = (file: string, context: Context) => {
  writeFileSync(file, JSON.stringify(context, null, 2));
};
