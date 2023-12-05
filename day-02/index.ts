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

const possibleGames = lines.filter((line) => {
  if (!line) return false

  const roundTotals = parseLineTotals(line.split(': ')[1])
  console.log(roundTotals)
  return roundTotals.every((round) => round.red <= MAX.RED && round.green <= MAX.GREEN && round.blue <= MAX.BLUE)
})

const sumOfGames = possibleGames.reduce((prev, cur) => {
  const n = cur.match(/\d+/)
  if (!n) throw new Error(`Failed to parse number from: ${cur}`)

  return prev + parseInt(n[0])
}, 0)

console.log(sumOfGames)

function parseLineTotals (line: string): ColourCounts[] {
  // Sample: "Game 8: 6 green, 7 blue; 9 green, 6 blue; 7 blue, 1 red, 3 green"
  // Array [ '3 blue', '4 red', '1 red', '2 green', '6 blue', '2 green' ]
  const rounds = line
    .split(';')
    .map(s => s.trim().match(/\d+ \w+/g))

  // Rounds is an array and contains 3 rounds (in this example)
  // [
  //   [ '6 green', '7 blue' ],
  //   [ '9 green', '6 blue' ],
  //   [ '7 blue', '1 red', '3 green' ]
  // ]
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
