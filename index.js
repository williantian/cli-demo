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

module.exports.showAll = async () => {
	// 读取之前的任务
	const list = await db.read();
	// 打印之前的任务
	list.forEach((task, index) => {
		console.log(`${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`)
	});
	
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
					switch (answers2.action) {
						case 'markAsDone':
							list[answers.index].done = true;
							db.write(list);
							break;
						case 'markAsUndone':
							list[answers.index].done = false;
							db.write(list);
							break;
						case 'updateTitle':
							inquirer.prompt({
								type: 'input',
								name: 'title',
								message: '新的标题',
								default: list[answers.index].title
							}).then((answers3) => {
								list[answers.index].title = answers3.title;
								db.write(list);
							});
							break;
						case 'remove':
							list.splice(answers.index, 1);
							db.write(list);
							break;
					}
				})
			} else if (answers.index === -2) {
				// 创建任务
				inquirer.prompt({
					type: 'input',
					name: 'title',
					message: '输入任务标题'
				}).then((answers4) => {
					console.log('answers', answers, answers.title);
					list.push({
						title: answers4.title,
						done: false
					});
					db.write(list);
				});
			}
		});
};
