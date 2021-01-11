//
// Copyright 2020 DXOS.org
//

import fs, { WriteStream } from 'fs';
import os from 'os';
import strip from 'strip-comments';

export const replace = async (path: string, writer?: WriteStream): Promise<{ lines: number }> => {
  return new Promise(resolve => {
    const data = fs.readFileSync(path, 'utf8');

    let count = 0;
    let blank = 0;

    // https://www.npmjs.com/package/strip-comments
    const lines = strip(data).split(os.EOL).map(line => {
      if (line.trim().length === 0) {
        blank++;
      } else {
        count++;

        // Compress multiple blank lines into one.
        // NOTE: This may cause a lint error if the first method of a class has a comment.
        if (blank) {
          blank = 0;
          if (count > 1) {
            return os.EOL + line;
          }
        }

        return line;
      }
    }).filter(Boolean);

    writer && writer.write(lines.join(os.EOL) + os.EOL);

    resolve({ lines: lines.length });
  });
};
