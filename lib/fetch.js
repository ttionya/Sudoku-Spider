import process from 'process';
import superAgent from 'superagent';
import cheerio from 'cheerio';
import { mapLimit } from 'async';
import chalk from 'chalk';
import { saveData } from  './database';
import config from '../config';

import getAnswer from './functions/getAnswer';
import getQuestion from './functions/getQuestion';
import getInformation from './functions/getInformation';

/*
 * @array: 数组
 */
export const fetch = (array) => {
    return new Promise((resolve, reject) => {

        let failArray = [1], // 存放请求失败的 id
            notSudokuCount = 0, // 请求成功但是没有题目的数量
            concurrencyCount = 0; // 并发数

        mapLimit(array, config.limit, (id, callback) => {

            // 并发数计数器 +1s
            concurrencyCount++;

            superAgent.get(config.url.replace('{{SUDOKU}}', id.toString()))
                .set({
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, sdch',
                    'Host': 'www.oubk.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36'
                })
                .end(async (err, result) => {
                    if (err) {
                        failArray.push(id); // 请求失败

                        // 输出日志
                        config.log && console.log(chalk.blue('[内存 ' + Math.round(process.memoryUsage().rss / 1000000).toString() + 'M]')
                            + ' '
                            + chalk.yellow('[并发数 ' + concurrencyCount.toString() + ' 个]')
                            + ' '
                            + chalk.red('数独 ' + id.toString() + ' 抓取失败')
                        );

                        console.error(chalk.red('遇到一些错误：' + err.toString()));
                    }
                    else {
                        let $ = cheerio.load(result.text);

                        // 获取答案
                        const sudokuAnswer = getAnswer($);

                        // 有答案才继续
                        if (sudokuAnswer) {

                            // 获取题目
                            const sudokuQuestion = getQuestion($);

                            // 获取类型和难度
                            const { sudokuType, sudokuLevel } = getInformation($, id);

                            // 输出日志
                            config.log && console.log(chalk.blue('[内存 ' + Math.round(process.memoryUsage().rss / 1000000).toString() + 'M]')
                                + ' '
                                + chalk.yellow('[并发数 ' + concurrencyCount.toString() + ' 个]')
                                + ' '
                                + chalk.blue('正在抓取编号为 ' + id.toString() + ' 的 ' + sudokuType)
                            );

                            // 写数据
                            await saveData({
                                sid: id,
                                question: sudokuQuestion,
                                answer: sudokuAnswer,
                                type_name: sudokuType,
                                level: sudokuLevel
                            })
                                .then(() => {

                                })
                                .catch(err => {
                                    console.log(err.errors[0].message);
                                });

                            // 重置数量
                            notSudokuCount = 0;
                        }
                        else {
                            notSudokuCount++;
                        }
                    }

                    // 并发数计数器负向 +1s
                    concurrencyCount--;

                    // 若超过错误数阈值，则跳过
                    if (notSudokuCount >= config.notSudokuLimitCount) {
                        callback('skip'); // 使用指定字符串
                    }
                    else {
                        callback(null);
                    }
                });
        }, (err, result) => {
            if (err && err !== 'skip') {
                reject(failArray);
            }
            else {
                resolve(failArray);
            }
        });
    });
};