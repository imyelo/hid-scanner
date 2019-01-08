import fs from 'fs-extra'
import path from 'path'

const fixture = async (filename) => await fs.readFile(path.resolve(__dirname, `../fixtures/${filename}`), 'utf8')

export default fixture
