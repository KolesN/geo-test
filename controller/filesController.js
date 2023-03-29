import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readFile (filename) {
  return await fs.readFile(path.resolve(__dirname, `../${filename}`), { encoding: 'utf8' })
    .then(( data ) => JSON.parse(data))
    .catch(err => console.log(err))

}

export async function writeFile (filename, text) {
  return await fs.writeFile(path.resolve(__dirname, `../${filename}`), text, { encoding: 'utf8' })
  .catch(err => console.log(err))
}



