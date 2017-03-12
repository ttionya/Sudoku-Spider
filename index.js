import "babel-polyfill";
import chalk from 'chalk';
import * as db from  './lib/database';
import fetch from './lib/fetch';
import config from './config';


let fetchWeb = async () => {
    await db.initDB();
    console.log(chalk.green('\n数据库初始化完成\n'));


    const rules = config.rules; // 规则数组
    let finFailArray = []; // 重试一次依旧失败的 id 的数组

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

        // 开始抓取
        let failArray = await fetch(array);

        // 只重试一次
        if (failArray.length) {
            console.log(chalk.yellow('\n开始重试请求失败的 id：' + failArray.join() + '\n'));
            finFailArray.push(await fetch(failArray));
        }
    }


    // 扁平化数组
    // finFailArray = finFailArray.reduce(function(a, b) {
    //     return a.concat(b);
    // });

    // 保存失败数据到文件，以便手动重试

};

fetchWeb()
    .then(() => console.log(chalk.green('\n爬虫运行结束')))
    .catch(err => console.error(chalk.red('\n爬虫停止运行，错误原因：\n' + err.message)));