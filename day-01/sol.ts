import { readFileSync } from 'fs'
import { join } from 'path'

let total = 0
const lines = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n')

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

for (const line of lines) {
  if (!line) continue;
  
  console.log('\nLine:', line)
  
  const first = getFirstNumber(line)
  
  if (!first) {
    throw new Error('No first number!')
  }
  console.log('remaining', first[1])
  const second = getSecondNumber(first[1])

  console.log('First:', first[0])

  if (second) {
    console.log('Second:', second)
    total += parseInt(`${first[0]}${second}`, 10)
  } else {
    total += parseInt(`${first[0]}${first[0]}`, 10)
  }
}
console.log('Total:', total)

function getFirstNumber (line: string): [string, string]|undefined {
  let buffer = ''

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char >= '0' && char <= '9') {
      return [char, line.substring(i + 1, line.length)]
    } else {
      buffer += char
      const numberFromBuffer = getNumberFromBuffer(buffer)

      if (numberFromBuffer) {
        return [numberFromBuffer, line.substring(i + 1, line.length)]
      }
    }
  }
}

function getSecondNumber (line: string): string|undefined {
  let buffer = ''

  for (let i = line.length - 1; i >= 0; i--) {
    const char = line[i]
    
    if (char >= '0' && char <= '9') {
      return char
    } else {
      buffer = `${char}${buffer}`
      const numberFromBuffer = getNumberFromBuffer(buffer)

      if (numberFromBuffer) {
        return numberFromBuffer
      }
    }
  }
}

function getNumberFromBuffer (buf: string) {
  const keys = Object.keys(numbersMap)
  
  const numberKey = keys.find((k) => {
    return buf.includes(k)
  })

  if (numberKey) {
    return numbersMap[numberKey]
  }
}
