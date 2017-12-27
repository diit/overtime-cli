#!/usr/bin/env node

'use strict'

const Table = require('cli-table2')
const assert = require('assert')
const { DateTime } = require('luxon')
const chalk = require('chalk')


const vorpal = require('vorpal')()

const NIGHT_TIME_START = 20
const NIGHT_TIME_END = 9

const ALIAS_SPLITTER = '@';

vorpal.command('show [regions...]', 'Generates time overlap table')
  .alias('table')
  .action(function (args, cb) {

    // TODO: BETTER VALIDATION
    assert(args.regions.length > 0)

    const pairs = args.regions.map((region) => {

      return (region.includes(ALIAS_SPLITTER)) ? region.split(ALIAS_SPLITTER) : [region, region]

    });

    const regions = pairs.map(pair => pair[0]);
    const aliases = pairs.map(pair => pair[1]);

    const table = new Table({
      head: aliases
    })

    // TODO: Pivot from primary
    const getRegionsTime = region => {
      const now = DateTime.local()
      return now.setZone(region)
    }

    const formatTime = time => {
      const displayString = ` ${time.toLocaleString({
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })} `
      if (time.hour > NIGHT_TIME_START || time.hour < NIGHT_TIME_END) {
        return chalk.grey.bgBlack(displayString)
      }
      return chalk.black.bgYellow(displayString)
    }

    for (let hour = 0; hour < 24; hour++) {
      const row = []
      regions.forEach(region => {
        row.push(formatTime(getRegionsTime(region).plus({
          hours: hour
        }).set({
          minutes: 0
        })))
      })
      table.push(row)
    }

    this.log(table.toString())
    cb(null, table.toString())
  })

vorpal
  .delimiter('$ ')
  .show()
  .parse(process.argv)
