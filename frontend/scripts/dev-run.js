const { spawn } = require('child_process');
const port = process.env.PORT || 3000;
console.log(`Starting dev server...`);
console.log(`Local: http://localhost:${port}`);
console.log(`Remote: use your network address as needed`);

// Forward to react-scripts start
const proc = spawn('npm', ['run', 'start'], { stdio: 'inherit', shell: true });
proc.on('close', (code) => process.exit(code));
