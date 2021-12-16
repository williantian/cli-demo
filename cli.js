#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const api = require('./index');
const pkg = require('./package');
program
	.version(pkg.version)
	.option('-x, --xxx', 'this is x');
program
	.command('add')
	.description('add a task')
	.action((source, destination) => {
			console.log('source, destination', source, destination.args);
			api.add(destination.args.join(''));
	});

program
	.command('clear')
	.description('clear all tasks')
	.action((source, destination) => {
		console.log('source, destination', source, destination.args);
		api.clear();
	});

if (process.argv.length === 2) {
	// 说明没有传参数 直接运行node cli.js
	api.showAll();
	return;
}
program.parse(process.argv);
const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:', options, process.argv);
