import { promises as fs } from 'fs'

const [rootPackage, distPackage] = await Promise.all([
  (async () => JSON.parse(await fs.readFile('package.json', 'utf8')))(),
  (async () => JSON.parse(await fs.readFile('dist/package.json', 'utf8')))()
])

distPackage.dependencies = rootPackage.dependencies

await fs.writeFile('dist/package.json', JSON.stringify(distPackage, null, 2))
console.log('Dependencies synced successfully')