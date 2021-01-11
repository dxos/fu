//
// Copyright 2020 DXOS.org
//

// @ts-ignore
import { hideBin } from 'yargs/helpers';

import { procesor } from './main';

procesor(hideBin(process.argv));
