import process from 'process';
import fs from 'fs';
import chalk from 'chalk';
import moment from 'moment';
import config from '../../config';


// 信息
const bMessage = message => chalk.blue(message);
const yMessage = message => chalk.yellow(message);
const gMessage = message => chalk.green(message);
const rMessage = message => chalk.red(message);
const eMessage = message => chalk.gray(message);


// 获取当前内存使用情况
const memoryUsage = () => '[' + Math.round(process.memoryUsage().rss / 1000000).toString() + 'M]';

// 获取当前并发数
const concurrencyCount = concurrencyCount => '[' + concurrencyCount.toString() + ']';


// 写文件
const writeFileSync = message => fs.appendFileSync(process.cwd() + '/logs.log', message);


/*
 * [内存使用情况] - 蓝色
 * [并发数] - 黄色
 * [操作] - 红色 > 黄色 > 蓝色 > 绿色
 * (sid - 数独名称) - 黄色
 * [附加信息] - 绿色 / 红色
 *
 * options {
 *     type: INFO | SUCCESS | WARN | ERROR || INFO,
 *     concurrencyCount: Int || -,
 *     action: '',
 *     message: '',
 *     errorMessage: '',
 *     sId: Int || 0,
 *     sType: String || -,
 *     show: boolean
 * }
 */
const formatMessage = (options) => {
    const logLevelArr = ['INFO', 'SUCCESS', 'WARN', 'ERROR'];

    options.type = options.hasOwnProperty('type') ? options.type : 'INFO';
    options.concurrencyCount = concurrencyCount(options.hasOwnProperty('concurrencyCount') ? options.concurrencyCount : '-');
    options.sId = options.hasOwnProperty('sId') ? options.sId.toString() : '0';
    options.sType = options.hasOwnProperty('sType') ? ' - ' + options.sType : '';
    options.action = '[' + options.hasOwnProperty('action') ? options.action : '　　　　' + ']';
    options.message = options.hasOwnProperty('message') ? options.message + ' ' : '';
    options.errorMessage = options.hasOwnProperty('errorMessage') ? options.errorMessage : '';

    // 是否保存到日志文件
    let logFile = (logLevelArr.indexOf(options.type) >= logLevelArr.indexOf(config.logLevel)) ? true : false,
        now = '[' + moment().format("YYYY-MM-DD HH:mm:ss") + ']';

    if (options.show || logFile) {
        let noColorLog = now
            + ' '
            + memoryUsage()
            + ' '
            + options.concurrencyCount
            + ' '
            + options.action
            + ' '
            + '(' + options.sId + options.sType + ')'
            + ' '
            + options.message
            + options.errorMessage;

        writeFileSync(noColorLog + '\n');
    }


    switch (options.type) {
        case 'INFO':
            options.action = bMessage(options.action);

            break;
        case 'SUCCESS':
            options.action = gMessage(options.action);

            break;
        case 'WARN':
            options.action = yMessage(options.action);

            break;
        case 'ERROR':
            options.action = rMessage(options.action);

            break;
        default:
            // 不会出现这情况
    }
    options.message = bMessage(options.message);
    options.errorMessage = rMessage(options.errorMessage);

    console.log(eMessage(now)
        + ' '
        + bMessage(memoryUsage())
        + ' '
        + options.concurrencyCount
        + ' '
        + options.action
        + ' '
        + yMessage('(' + options.sId + options.sType + ')')
        + ' '
        + bMessage(options.message)
        + rMessage(options.errorMessage)
    );
};

export {
    bMessage,
    yMessage,
    gMessage,
    rMessage,
    eMessage,
    writeFileSync,
    formatMessage
};