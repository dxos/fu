//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import os from 'os';
import readline from 'readline';
import strip from 'strip-comments';

export const replace = async (input: string, output?: string): Promise<{ lines: number }> => {
  let lines = 0;
  let skipped = 0;

  return new Promise(resolve => {
    const reader = readline.createInterface({
      input: fs.createReadStream(input)
    });

    const writer = output && fs.createWriteStream(output);

    reader.on('line', (line) => {
      const out = strip(line);
      if (!out.length) {
        skipped++;
      }

      if (out.length) {
        if (skipped) {
          if (lines) {
            writer && writer.write(os.EOL);
          }
          skipped = 0;
        }

        writer && writer.write(out + os.EOL);
        lines++;
      }
    });

    reader.on('close', () => {
      writer && writer.close();
      resolve({ lines });
    });
  });
};
