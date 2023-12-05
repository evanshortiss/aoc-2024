import readline from 'node:readline'
import { createReadStream } from 'node:fs'
import { join } from 'node:path'

let total = 0

const reader = readline.createInterface({ input: createReadStream(join(__dirname, 'input.txt')) });

const numbersMap: { [key: string]: string } = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9'
}

reader.on('line', (line) => {
  const first = getNumber(line, 1)!
  const second = getNumber(line, -1)!
  
  total += parseInt(`${first}${second}`, 10)
})

reader.on('close', () => {
  console.log('Result:', total)
  process.exit(0)
})

function getNumber (line: string, direction: -1|1): string|undefined {
  let buffer = []
  let chars = line.split('')

  if (direction === -1) {
    chars.reverse()
  }

  while (chars.length > 0) {
    const char = chars.shift()!

    if (char >= '0' && char <= '9') {
      return char
    } else {
      buffer.push(char)
      const numberFromBuffer = getNumberFromBuffer(direction === 1 ? buffer.join('') : buffer.slice(0).reverse().join(''))

      if (numberFromBuffer) {
        return numberFromBuffer
      }
    }
  }
}

function getNumberFromBuffer (buf: string) {
  console.log('buf', buf)
  const keys = Object.keys(numbersMap)
  
  const numberKey = keys.find((k) => {
    return buf.includes(k)
  })

  if (numberKey) {
    return numbersMap[numberKey]
  }
}
