#!/usr/bin/env node

'use strict'

const Table = require('cli-table2')
const assert = require('assert')
const { DateTime } = require('luxon')
const chalk = require('chalk')

const vorpal = require('vorpal')()

let START_WORK = 9
let END_WORK = 20

vorpal.command('show [regions...]', 'Generates time overlap table')
  .alias('table')
  .action(function (args, cb) {
    // TODO: BETTER VALIDATION
    assert(args.regions.length > 0)
    const table = new Table({
      head: args.regions
    })

    // TODO: Pivot from primary
    const getRegionsTime = region => {
      const now = DateTime.local()
      return now.setZone(region)
    }

    vorpal.localStorage('overtime-cli');
    let START_WORK_TMP = vorpal.localStorage.getItem('START_WORK')
    let END_WORK_TMP = vorpal.localStorage.getItem('END_WORK')
    if (START_WORK_TMP !== null) {
      START_WORK = START_WORK_TMP
    }
    if (END_WORK_TMP !== null) {
      END_WORK = END_WORK_TMP
    }

    const formatTime = time => {
      const displayString = ` ${time.toLocaleString({
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })} `
      if (time.hour > END_WORK || time.hour < START_WORK) {
        return chalk.grey.bgBlack(displayString)
      }
      return chalk.black.bgYellow(displayString)
    }

    for (let hour = 0; hour < 24; hour++) {
      const row = []
      args.regions.forEach(region => {
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

vorpal.command('hours [hours...]', 'Set working hours')
  .action(function (args, cb) {
    var h = args.hours;
    if (h.length !== 2) {
      process.exit(1);
    }
    vorpal.localStorage('overtime-cli');
    vorpal.localStorage.setItem('START_WORK', h[0]);
    vorpal.localStorage.setItem('END_WORK', h[1]);
  })

vorpal
  .delimiter('$ ')
  .show()
  .parse(process.argv)
