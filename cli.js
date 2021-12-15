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
	});
program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:', options);
