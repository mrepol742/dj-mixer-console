const fs = require('fs');
const path = require('path');

const dotenvPath = path.join(__dirname, '.env');
if (fs.existsSync(dotenvPath)) {
  require('dotenv').config({ path: dotenvPath });
}

const envFolder = path.join(__dirname, 'src/environments');
const targetPath = path.join(envFolder, 'environment.ts');

if (!fs.existsSync(envFolder)) {
  fs.mkdirSync(envFolder, { recursive: true });
}

const envVariables = Object.keys(process.env)
  .map((key) => `  ${key}: '${process.env[key] || ''}'`)
  .join(',\n');

const envFileContent = `export const environment = {
${envVariables}
};
`;

fs.writeFileSync(targetPath, envFileContent);
console.log(`[Generated file]: ${targetPath}`);
