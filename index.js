#!/usr/bin/env node

const { DateTime } = require('luxon')

const NIGHT_TIME_START = 20
const NIGHT_TIME_END = 9
const GREY_BLACK = '\u001b[90m\u001b[40m'
const BLACK_YELLOW = '\u001b[30m\u001b[43m'

const regions = process.argv.slice(2)
if (regions.length === 0) throw new Error('At least one region must be specified')

const wrap = (a, t) => `${a} ${t} \u001b[49m\u001b[39m`
const rows = [[], [], []]

for (const region of regions) {
  const l = Math.max(region.length + 2, 9)
  rows[0].push(l)
  rows[1].push(region)
  rows[2].push(l)
}

const spacerRow = `├${rows[0].map((l) => '─'.repeat(l)).join('┼')}┤`

let first = true
for (let hour = 0; hour < 24; hour++) {
  if (first) {
    first = false
  } else {
    rows.push(spacerRow)
  }

  const row = []

  for (const i in regions) {
    const region = regions[i]
    const t = DateTime.local()
      .setZone(region)
      .plus({ hours: hour })
      .set({ minutes: 0 })

    const displayString = t.toLocaleString({ hour: 'numeric', minute: 'numeric' })
    const color = t.hour > NIGHT_TIME_START || t.hour < NIGHT_TIME_END ? GREY_BLACK : BLACK_YELLOW
    const wrapped = wrap(color, displayString)
    const l = rows[0][i] - displayString.length
    row.push(` ${wrapped}${' '.repeat(l - 3)}`)
  }

  rows.push(`│${row.join('│')}│`)
}

rows.push(`└${rows[0].map((l) => '─'.repeat(l)).join('┴')}┘`)

rows[0] = `┌${rows[0].map((l) => '─'.repeat(l)).join('┬')}┐`
rows[1] = `│ ${rows[1].map((r) => `\u001b[31m${r.padEnd(7, ' ')}\u001b[39m`).join(' │ ')} │`
rows[2] = `├${rows[2].map((l) => '─'.repeat(l)).join('┼')}┤`

process.stdout.write(`${rows.join('\n')}\n`)
