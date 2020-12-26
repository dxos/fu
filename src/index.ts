//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import util from 'util';

import { replace } from './replace';
import { walk } from './walk';

// @ts-ignore
import { hideBin } from 'yargs/helpers';

// TODO(burdon): Parse .gitignore

yargs(hideBin(process.argv))
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Verbose logging.'
  })
  .option('dir', {
    type: 'string',
    description: 'Root directory.'
  })
  .option('dryRun', {
    type: 'boolean',
    description: 'Test run.'
  })
  .option('extensions', {
    alias: 'ext',
    type: 'string',
    description: 'File extensions.'
  })

  // loc
  .command('loc', 'count lines of code', () => {}, async argv => {
    if (!argv.dir) {
      return;
    }

    const col = 8;
    let count = 0;
    const files = await util.promisify(walk)(argv.dir) || [];
    for (const file of files.filter(filterExtensions(argv.extensions)).map(mapRelative)) {
      const { lines } = await replace(file);
      console.log(String(lines).padStart(col), file);
      count += lines;
    }

    console.log(String(count).padStart(col), 'Total');
  })

  // strip
  .command('strip', 'strip comments', () => {}, async argv => {
    if (!argv.dir) {
      return;
    }

    const files = await util.promisify(walk)(argv.dir) || [];
    for (const file of files.filter(filterExtensions(argv.extensions)).map(mapRelative)) {
      const tmpFile = '/tmp/strip.txt';
      await replace(file, tmpFile);
      if (!argv.dryRun) {
        fs.renameSync(tmpFile, file);
      }
    }
  })

  .argv;

const mapRelative = (file: string) => path.relative(process.cwd(), file);

const filterExtensions = (extensions?: string): (file: string) => boolean => {
  if (!extensions) {
    return () => true;
  }

  const regexp = extensions && new RegExp('\.(' + extensions.split(',').join('|') + ')$');
  return file => !!file.match(regexp);
};
