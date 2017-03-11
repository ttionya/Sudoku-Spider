import "babel-polyfill";
import chalk from 'chalk';
import * as db from  './lib/database';
import { fetch } from './lib/fetch';
import config from './config';


let fetchWeb = async () => {
    await db.initDB();
    console.log(chalk.green('\n数据库建立完成\n'));


    const rules = config.rules; // 规则数组

    for (let index of rules) {
        let lastIndex = index + config.maxPerSudokuId,
            array = [],
            maxSId;

        // 先判断数据库中有多少数据，从最后一个 Id 开始请求，以避免多余请求
        maxSId = await db.queryData(index, lastIndex);
        index = maxSId || (index - 1); // NaN 赋值 index - 1

        for (let i = index + 1; i < lastIndex; i++) {
            array.push(i);
        }

        await fetch(array);
    }
};

fetchWeb()
    .then(() => console.log(chalk.green('\n爬虫运行完毕')))
    .catch(err => console.error(chalk.red('\n爬虫停止运行，错误原因：\n' + err.message)));