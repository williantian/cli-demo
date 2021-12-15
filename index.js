const db = require('./db');
const inquirer = require('inquirer');

module.exports.add = async (title) => {
	// 读取之前的任务
	const list = await db.read();
	// 往里面添加一个 title 任务
	list.push({title, done: false});
	// 存储任务到文件
	await db.write(list);
};

module.exports.clear = async () => {
	await db.write([])
};

function printTasks (list) {
	inquirer
		.prompt({
			type: 'list',
			name: 'index',
			message: '请选择你想操作的任务',
			choices: [{name: '退出', value: -1}, ...list.map((task, index) => {
				return {name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index}
			}), {name: '创建任务', value: -2}]
		})
		.then((answers) => {
			if (answers.index >= 0) {
				// 选中一个任务
				askForAction(list, answers.index)
			} else if (answers.index === -2) {
				// 创建任务
				askForCreateTask(list);
			}
		});
}

function askForCreateTask(list) {
	inquirer.prompt({
		type: 'input',
		name: 'title',
		message: '输入任务标题'
	}).then((answers4) => {
		list.push({
			title: answers4.title,
			done: false
		});
		db.write(list);
	});
}

function markAsDone(list, index) {
	list[index].done = true;
	db.write(list);
}

function markAsUndone(list, index) {
	list[index].done = false;
	db.write(list);
}

function updateTitle(list, index) {
	inquirer.prompt({
		type: 'input',
		name: 'title',
		message: '新的标题',
		default: list[index].title
	}).then((answers3) => {
		list[index].title = answers3.title;
		db.write(list);
	});
}

function remove(list, index) {
	list.splice(index, 1);
	db.write(list);
}

function askForAction (list, index) {
	const actions = {
		markAsDone,
		markAsUndone,
		updateTitle,
		remove
	};
	inquirer
		.prompt([{
			type: 'list',
			name: 'action',
			message: '请选择操作',
			choices: [
				{name: '退出', value: 'quit'},
				{name: '已完成', value: 'markAsDone'},
				{name: '未完成', value: 'markAsUndone'},
				{name: '改标题', value: 'updateTitle'},
				{name: '删除', value: 'remove'},
			]
		}]).then(answers2 => {
			const action = actions[answers2.action];
			action && action(list, index);
	})
}
module.exports.showAll = async () => {
	// 读取之前的任务
	const list = await db.read();
	// 打印之前的任务
	list.forEach((task, index) => {
		console.log(`${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`)
	});
	printTasks(list)
};
