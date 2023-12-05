import { readFileSync } from 'node:fs'
import { join } from 'node:path'

enum Colour {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}

type ColourCounts = {
  [Colour.Red]: number
  [Colour.Green]: number
  [Colour.Blue]: number
}

const MAX = {
  RED: 12,
  GREEN: 13,
  BLUE: 14
}

const lines = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n')

const powerOfGames = lines.reduce((sum, line) => {
  if (!line) return sum

  const keys = Object.values(Colour)
  const roundTotals = parseLineTotals(line.split(': ')[1])

  const minRequired: ColourCounts = {
    red: 0,
    green: 0,
    blue: 0
  }
  
  roundTotals.forEach((round) => {
    keys.forEach((k) => {
      if (minRequired[k as Colour] < round[k as Colour]) {
        minRequired[k as Colour] = round[k as Colour]
      }
    })
  })

  const power = Math.max(1, minRequired['blue']) * Math.max(1, minRequired['green']) * Math.max(1,minRequired['red'])

  return sum + power
}, 0)

console.log('Result: ', powerOfGames)

function parseLineTotals (line: string): ColourCounts[] {
  const rounds = line.split(';').map(s => s.trim().match(/\d+ \w+/g))

  return rounds.map((round) => {
    if (!round) {
      throw new Error(`failed to parse rounds from line: ${line}`)
    }

    const container: ColourCounts = {
      red: 0,
      green: 0,
      blue: 0
    }

    for (const c of round) {
      const parts = c.split(' ')
      container[parts[1] as Colour] += parseInt(parts[0])
    }

    return container
  })
}
