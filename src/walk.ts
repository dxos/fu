//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import path from 'path';

export const walk = (dir: string, done: (err?: Error, results?: string[]) => void) => {
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
            walk(file, (_, res = []) => {
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
