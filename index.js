const homedir = require('os').homedir(); // 获取系统home目录
const home = process.env.HOME || homedir; // 获取用户设置环境变量设置的home目录
const fs = require('fs');
const path = require('path');
const dbPath = path.join(home, 'todo'); // 组合路径
module.exports.add = (title) => {
	// 读取之前的任务
	fs.readFile(dbPath, {flag: 'a+'}, (error, data) => {
		if (error) throw error;
		let list = data.toString() ? JSON.parse(data.toString()) : [];
		console.log('list', list);
		const task = {
			title,
			done: false
		};
		list.push(task);
		const string = JSON.stringify(list);
		fs.writeFile(dbPath, string + '\n', (error3) => {
			if (error3) throw error3;
		})
	});
	// 往里面添加一个 title 任务
	// 存储任务到文件
};
