import process from 'process';
import chalk from 'chalk';


// 获取当前内存使用情况
const memoryUsage = () => chalk.blue('[' + Math.round(process.memoryUsage().rss / 1000000).toString() + 'M]');

// 获取当前并发数
const concurrencyCount = concurrencyCount => chalk.yellow('[' + concurrencyCount.toString() + ']');

// 错误信息
const errorMessage = message => chalk.red(message);

// 普通信息
const normalMessage = message => chalk.blue(message);
const normalYMessage = message => chalk.yellow(message);
const normalGMessage = message => chalk.green(message);


export {
    memoryUsage,
    concurrencyCount,
    errorMessage,
    normalMessage,
    normalYMessage,
    normalGMessage
};