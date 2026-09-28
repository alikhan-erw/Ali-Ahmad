import { spawn } from 'child_process';

const args = process.argv.slice(2);
let port = '3000';
let host = '0.0.0.0';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' || args[i] === '-p') {
    port = args[++i] || '3000';
  } else if (args[i].startsWith('--port=')) {
    port = args[i].split('=')[1];
  } else if (args[i] === '--host' || args[i] === '-H' || args[i] === '--hostname') {
    host = args[++i] || '0.0.0.0';
  } else if (args[i].startsWith('--host=')) {
    host = args[i].split('=')[1];
  }
}

const child = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'dev', '-p', port, '-H', host],
  { stdio: 'inherit' }
);

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
