// Punto d'ingresso unico, uguale su GitHub e sul PC: imposta le cartelle e
// lancia l'aggiornamento (oppure solo il controllo dei dati).
import { spawnSync } from 'node:child_process';

const env = { ...process.env, MUEVT_DATA_DIR: 'dati', MUEVT_SNAPSHOT_DIR: 'storico' };
const script = process.argv.includes('--solo-controllo') ? 'scripts/check-data.mjs' : 'scripts/scrapers/run-daily.mjs';
const result = spawnSync(process.execPath, [script], { stdio: 'inherit', env });
process.exit(result.status ?? 1);
