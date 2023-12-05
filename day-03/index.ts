import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Contains numbers for a given line that have adjacent symbols.
// The starting index of the number in the string is used, so we
// avoid duplicate matches if a number touches multiple symbols
type LineNumbersEntry = {
  [index: number]: number
}

const lines = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n')
const ignore = '.0123456789'.split('')
const numbersTouchingSymbols: Array<LineNumbersEntry> = []

// Initialise storage for each line's numbers
lines.forEach((l, i) => numbersTouchingSymbols[i] = {})

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  // Break on newline EOF
  if (!line) break;

  for (let j = 0; j < line.length; j++) {
    const char = line[j]
    
    if (!ignore.includes(char)) {
      // Prev line
      if (i < line.length - 1) {
        getAdjacentNumbers(j, i + 1).forEach((ans) => {
          numbersTouchingSymbols[i + 1][ans.index] = parseInt(ans.value)
        })
      }

      // Current line
      getAdjacentNumbers(j, i).forEach((ans) => {
        numbersTouchingSymbols[i][ans.index] = parseInt(ans.value)
      })

      // Next line
      if (i > 0) {
        getAdjacentNumbers(j, i - 1).forEach((ans) => {
          numbersTouchingSymbols[i - 1][ans.index] = parseInt(ans.value)
        })
      }
    }
  }
}
writeFileSync('/tmp/day-03.json', JSON.stringify(numbersTouchingSymbols, null, 2))
const sum = numbersTouchingSymbols
  .map(entry => Object.values(entry))
  .flat()
  .reduce((sum, num) => {
    return sum + num
  }, 0)

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
