import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const cards = readFileSync(join(__dirname, 'input.txt'), 'utf-8').split('\n')
let result = 0

// Initialise copy count array. A single copy (original)
// of each card is given by default.
const copies: number[] = Array(cards.length).fill(1)

cards.forEach((card, number) => {
  if (!card) return // Newline EOF handling

  const sides = card.split(': ')[1].split(' | ')
  const winningNumbers = sides[0].split(' ').filter(n => n !== '')
  const assignedNumbers = sides[1].split(' ').filter(n => n !== '')

  console.log(`Copies of card ${number + 1}: ${copies[number]}`)
  
  while (copies[number]--) {
    result++

    assignedNumbers
      .filter((an) => winningNumbers.includes(an))
      .forEach((wn, idx) => copies[number + (idx + 1)] += 1)
  }
})

console.log(result)
