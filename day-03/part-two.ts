import { readFileSync } from 'node:fs'
import { join } from 'node:path'

let sum = 0

const lines = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n')

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  // Break on newline EOF
  if (!line) break;

  for (let j = 0; j < line.length; j++) {
    const char = line[j]
    
    if (char === '*') {
      const gears = [
        getAdjacentNumbers(j, i + 1),
        getAdjacentNumbers(j, i),
        getAdjacentNumbers(j, i - 1)
      ]
        .filter(g => g.length != 0)
        .flat()
      
      if (gears.length > 1) {
        sum += (parseInt(gears[0].value) * parseInt(gears[1].value))
      }
    }
  }
}

console.log('Sum', sum)

function getAdjacentNumbers (symbolPosition: number, lineToCheckForAdjacency: number) {
  const line = lines[lineToCheckForAdjacency]
  const regex = /\b\d+\b/g;
  const numbersInLine: { index: number, value: string }[] = []
  
  let match: RegExpExecArray | null

  while ((match = regex.exec(line)) !== null) {
    numbersInLine.push({
      index: match.index,
      value: match[0]
    })
  }

  return numbersInLine.filter((number) => {
    const len = number.value.length
    const lrange = number.index - 1
    const urange = number.index + len

    // Example, if symbol falls in any slot marked "Y", then it's
    // adjacent to the number
    // ['Y', 'Y', 'Y', 'Y', '.']
    // ['.', '.', '*', '.', '.']
    // ['.', '1', '2', '.', '.']

    return symbolPosition >= lrange && symbolPosition <= urange
  })
}
