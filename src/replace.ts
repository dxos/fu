//
// Copyright 2020 DXOS.org
//

import fs from 'fs';
import os from 'os';
import readline from 'readline';
import strip from 'strip-comments';

export const replace = async (input: string, output?: string): Promise<{ lines: number }> => {
  let lines = 0;
  let blank = 0;

  return new Promise(resolve => {
    const reader = readline.createInterface({
      input: fs.createReadStream(input)
    });

    const writer = output && fs.createWriteStream(output);

    reader.on('line', (line) => {
      if (line.trim().length === 0) {
        blank++;
      }

      const out = strip(line);
      if (out.trim().length) {
        //
        // Preserve single blank lines (unless start of file).
        //
        if (blank) {
          if (lines) {
            writer && writer.write(os.EOL);
          }

          blank = 0;
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
