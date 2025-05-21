#!/usr/bin/env node

import chalk from "chalk";
import Table from "cli-table3";
import { Command } from "commander";
import { DateTime } from "luxon";

const NIGHT_TIME_START = 20;
const NIGHT_TIME_END = 9;
const ALIAS_SPLITTER = "@";

const program = new Command();
program
	.name("overtime")
	.description("Generates time overlap table for regions")
	.argument(
		"<regions...>",
		"List of IANA time zone names, optionally with aliases (e.g. America/New_York@NY)",
	)
	.action((regions) => {
		if (!regions || regions.length === 0) {
			console.error(chalk.red("Error: At least one region must be specified."));
			process.exit(1);
		}

		const pairs = regions.map((region) =>
			region.includes(ALIAS_SPLITTER)
				? region.split(ALIAS_SPLITTER)
				: [region, region],
		);
		const tzs = pairs.map((pair) => pair[0]);
		const aliases = pairs.map((pair) => pair[1]);

		// Validate timezones
		for (const tz of tzs) {
			if (!DateTime.local().setZone(tz).isValid) {
				console.error(chalk.red(`Invalid timezone: ${tz}`));
				process.exit(1);
			}
		}

		const table = new Table({ head: aliases });
		const now = DateTime.local();

		for (let hour = 0; hour < 24; hour++) {
			const row = tzs.map((tz) => {
				const time = now.setZone(tz).plus({ hours: hour }).set({ minute: 0 });
				const displayString = ` ${time.toLocaleString({ hour: "numeric", minute: "2-digit", hour12: true })} `;
				if (time.hour >= NIGHT_TIME_START || time.hour < NIGHT_TIME_END) {
					return chalk.grey.bgBlack(displayString);
				}
				return chalk.black.bgYellow(displayString);
			});
			table.push(row);
		}
		console.log(table.toString());
	});

program.parse(process.argv);
