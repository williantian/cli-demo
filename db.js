const homedir = require('os').homedir(); // 获取系统home目录
const home = process.env.HOME || homedir; // 获取用户设置环境变量设置的home目录
const fs = require('fs');
const path = require('path');
const dbPath = path.join(home, 'todo'); // 组合路径
const db = {
	read(path = dbPath) {
		return new Promise((resolve, reject) => {
			fs.readFile(path, {flag: 'a+'}, (error, data) => {
				if (error) return reject(error);
				let list = data.toString() ? JSON.parse(data.toString()) : [];
				resolve(list);
			});
		});
	},
	write (list, path = dbPath) {
		return new Promise((resolve, reject) => {
			const string = JSON.stringify(list);
			fs.writeFile(path, string + '\n', (error) => {
				if (error) return reject(error);
				resolve()
			})
		});
	}
}
module.exports = db;
