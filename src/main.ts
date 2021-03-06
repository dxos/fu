//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

import { strip } from './strip';
import { walk } from './walk';
import os from 'os';

// TODO(burdon): File prefix.
// TODO(burdon): Parse .gitignore.

const mapRelative = (file: string) => path.relative(process.cwd(), file);

const filterExtensions = (extensions?: string): (file: string) => boolean => {
  if (!extensions) {
    return () => true;
  }

  const regexp = extensions && new RegExp('\.(' + extensions.split(',').join('|') + ')$');
  return file => !!file.match(regexp);
};

export const procesor = (args: any) => yargs(args)
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Verbose logging'
  })
  .option('dry-run', {
    type: 'boolean',
    description: 'Do not process command'
  })
  .option('dir', {
    type: 'string',
    description: 'Glob pattern for directories'
  })
  .option('ignore', {
    type: 'string',
    description: 'Regular expression for directories to exclude'
  })
  .option('extensions', {
    alias: 'ext',
    type: 'string',
    description: 'File extensions'
  })

  // loc
  .command('loc', 'count lines of code', () => {}, async argv => {
    if (!argv.dir) {
      return;
    }

    const col = 8;
    let count = 0;

    const ignore = argv.ignore ? new RegExp(argv.ignore) : undefined;
    const files = await walk(argv.dir, ignore);
    for (const file of files.filter(filterExtensions(argv.extensions)).map(mapRelative)) {
      const text = await strip(file);
      const lines = text.split(os.EOL).length;
      console.log(String(lines).padStart(col), file);
      count += lines;
    }

    console.log(String(count).padStart(col), 'Total');
  })

  // strip
  .command('strip', 'strip comments', yargs => {
    yargs.option('replace', {
      type: 'boolean',
      description: 'Replace file'
    });
  }, async argv => {
    if (!argv.dir) {
      return;
    }

    const ignore = argv.ignore ? new RegExp(argv.ignore) : undefined;
    const files = await walk(argv.dir, ignore);
    for await (const file of files.filter(filterExtensions(argv.extensions)).map(mapRelative)) {
      if (argv.verbose) {
        console.log(`Processing ${file}`);
      }

      const text = await strip(file);

      if (!argv.dryRun) {
        if (argv.replace) {
          fs.writeFileSync(file, text);
        } else {
          console.log(os.EOL + '<<<<<<<<' + os.EOL + text + '>>>>>>>>' + os.EOL);
        }
      }
    }
  })

  .argv;
