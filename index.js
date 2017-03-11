import "babel-polyfill";
import chalk from 'chalk';
import * as db from  './lib/database';
import { fetch } from './lib/fetch';
import config from './config';


let fetchWeb = async () => {
    await db.initDB();
    console.log(chalk.green('数据库建立完成\n'));


    const rules = config.rules; // 规则数组

    for (let index of rules) {
        let lastIndex = index + config.maxPerSudokuId,
            array = [];

        // 先判断数据库中有多少数据，从最后一个 Id 开始请求，以避免多余请求
        index = await db.queryData(index, lastIndex); // 覆盖原先数字
        console.log(index)

        for (let i = index + 1; i < lastIndex; i++) {
            array.push(i);
        }

        // await fetch(array);
    }
};

fetchWeb()
    .then(() => console.log('Success!'))
    .catch(err => console.error(err.message));