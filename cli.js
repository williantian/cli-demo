const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');
const api = require('./index');
program
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
}
// program.parse(process.argv);
// const options = program.opts();
// if (options.debug) console.log(options);
// console.log('pizza details:', options, process.argv);
