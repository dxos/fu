//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import util from 'util';

export const walk = async (pattern: string): Promise<string[]> => {
  const results = [];

  // https://www.npmjs.com/package/glob
  const matches = await util.promisify(glob)(pattern, {});
  for await (const match of matches) {
    if (fs.lstatSync(match).isDirectory()) {
      const files = await util.promisify(walkDir)(match) || [];
      results.push(...files);
    }
  }

  return results;
};

const walkDir = (dir: string, done: (err?: Error, results?: string[]) => void) => {
  let results: string[] = [];

  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err);
    }

    let i = 0;
    const next = () => {
      let file = list[i++];
      if (!file) {
        return done(undefined, results);
      }

      file = path.resolve(dir, file);
      fs.stat(file, (_, stat) => {
        // Recurse directory.
        if (stat && stat.isDirectory()) {
          const parts = file.split('/');
          if (parts[parts.length - 1]) {
            walkDir(file, (_, res = []) => {
              // Flatten.
              results = results.concat([...res]);
              next();
            });
          }
        } else {
          results.push(file);
          next();
        }
      });
    };

    next();
  });
};
