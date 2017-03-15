import "babel-polyfill";
import * as logs from './lib/functions/logs';
import * as db from  './lib/database';
import fetch from './lib/fetch';
import config from './config';


const startTime = Date.now();

const getTimeDiff = () => {
    let seconds = Math.floor((Date.now() - startTime) / 1000), // 秒
        minutes = Math.floor(seconds / 60), // 分
        hours = Math.floor(minutes / 60), // 小时
        time = '';

    time += hours ? hours.toString() + ' 小时 ' : '';
    minutes = minutes - 60 * hours;
    time += minutes ? minutes.toString() + ' 分 ' : '';
    seconds = seconds - 60 * hours - 60 * minutes + 1;
    time += seconds.toString() + ' 秒';

    return time;
};


let fetchWeb = async () => {
    logs.formatMessage({
        type: 'WARN',
        action: '开始运行',
        show: true
    });

    // 初始化数据库
    await db.initDB();
    logs.formatMessage({
        type: 'WARN',
        action: '数据库初始化完成',
        show: true
    });


    const rules = config.rules; // 规则数组
    let finFailArray = []; // 重试一次依旧失败的 id 的数组

    for (let index of rules) {
        let lastIndex = index + config.maxPerSudokuId,
            array = [],
            maxSId;

        // 先判断数据库中有多少数据，从最后一个 Id 开始请求，以避免多余请求
        maxSId = await db.queryMax(index, lastIndex);
        index = maxSId || (index - 1); // NaN 赋值 index - 1

        for (let i = index + 1; i < lastIndex; i++) {
            array.push(i);
        }

        // 开始抓取
        let failArray = await fetch(array);

        // 只重试一次
        if (failArray.length) {

            // 输出日志
            config.log && logs.formatMessage({
                type: 'WARN',
                action: '失败重试',
                sId: failArray.join()
            });

            finFailArray.push(await fetch(failArray));
        }
    }


    // 输出失败数据，以便手动重试
    if (finFailArray.length) {

        // 扁平化数组
        finFailArray = finFailArray.reduce(function(a, b) {
            return a.concat(b);
        });

        // 输出日志
        logs.formatMessage({
            type: 'ERROR',
            action: '错误列表',
            sId: finFailArray.join()
        });
    }
};

fetchWeb()
    .then(() => {

        // 输出日志
        logs.formatMessage({
            type: 'SUCCESS',
            action: '运行完成',
            message: '共耗时 ' + getTimeDiff(),
            show: true
        });

    })
    .catch(err => {

        // 输出错误信息日志
        logs.formatMessage({
            type: 'ERROR',
            action: '爬虫停止运行',
            message: '共耗时 ' + getTimeDiff(),
            errorMessage: err.message
        });
    });