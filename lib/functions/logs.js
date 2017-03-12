import process from 'process';
import chalk from 'chalk';


// 信息
const bMessage = message => chalk.blue(message);
const yMessage = message => chalk.yellow(message);
const gMessage = message => chalk.green(message);
const rMessage = message => chalk.red(message);


// 获取当前内存使用情况
const memoryUsage = () => bMessage('[' + Math.round(process.memoryUsage().rss / 1000000).toString() + 'M]');

// 获取当前并发数
const concurrencyCount = concurrencyCount => yMessage('[' + concurrencyCount.toString() + ']');


/*
 * [内存使用情况] - 蓝色
 * [并发数] - 黄色
 * [操作] - 红色 > 黄色 > 蓝色 > 绿色
 * (sid - 数独名称) - 黄色
 * [附加信息] - 绿色 / 红色
 */
const formatMessage = (options) => {

    // 初始化
    options.concurrencyCount = options.hasOwnProperty('concurrencyCount') ? options.concurrencyCount : '-';
    options.id = options.hasOwnProperty('id') ? options.id.toString() : '0';
    options.type = options.hasOwnProperty('type') ? ' - ' + options.type : '';

    // 可立即输出
    options.action = options.hasOwnProperty('error') ? rMessage('[' + options.error + ']') :
        options.hasOwnProperty('warn') ? yMessage('[' + options.warn + ']') :
            options.hasOwnProperty('info') ? bMessage('[' + options.info + ']') :
                options.hasOwnProperty('succ') ? gMessage('[' + options.succ + ']') :
                    '　　　　';
    options.message = options.hasOwnProperty('message') ? bMessage(options.message + ' ') : '';
    options.errorMessage = options.hasOwnProperty('errorMessage') ? rMessage(options.errorMessage) : '';


    console.log(memoryUsage()
        + ' '
        + concurrencyCount(options.concurrencyCount)
        + ' '
        + options.action
        + ' '
        + yMessage('(' + options.id + options.type + ')')
        + ' '
        + options.message
        + options.errorMessage
    );
};

export {
    bMessage,
    yMessage,
    gMessage,
    rMessage,
    formatMessage
};