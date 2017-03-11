import superAgent from 'superagent';
import cheerio from 'cheerio';
import { mapLimit } from 'async';
import chalk from 'chalk';
import { saveData } from  './database';
import config from '../config';


/*
 * @array: 数组
 */
export const fetch = (array) => {
    return new Promise((resolve, reject) => {

        let failArray = [], // 存放请求失败的 id
            emptyCount = 0; // 请求成功但是没有题目的数量

        mapLimit(array, config.limit, function (id, callback) {
            superAgent.get(config.url.replace('{{SUDOKU}}', id.toString()))
                .end((err, res) => {
                    if (err) {
                        console.error('我是错误：' + err);
                    }
                    else {
                        let $ = cheerio.load(res.text);

                        // 获取答案
                        const sudokuAnswer = $('#hid_aw').val();

                        console.log(chalk.blue('答案是：') + chalk.green(sudokuAnswer)); // 这是答案

                        // 有答案才继续
                        if (sudokuAnswer) {

                            // 获取题目
                            let sudokuQuestion = [];
                            for (let i = 1; i < 10; i++) {
                                for (let j = 1; j < 10; j++) {
                                    sudokuQuestion.push($('#k' + j + 's' + i).val() || 0);
                                }
                            }
                            sudokuQuestion = sudokuQuestion.join('');

                            console.log(chalk.blue('题目是：') + chalk.green(sudokuQuestion)); // 这是题目

                            // 获取类型和难度
                            let titleArr = $('title').text().split('#' + id.toString())[0].trim().split('-'),
                                sudokuType = titleArr[0].trim(),
                                sudokuLevel = titleArr[1].trim();

                            console.log(chalk.blue('类型是：') + chalk.green(sudokuType)); // 这是类型
                            console.log(chalk.blue('难度是：') + chalk.green(sudokuLevel)); // 这是难度

                            // 转换难度为数字
                            const level = ['入门级', '初级', '中级', '高级', '骨灰级'];
                            sudokuLevel = level.indexOf(sudokuLevel) + 1;

                            // 写数据
                            saveData({
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

                            emptyCount = 0;
                        }
                        else {
                            emptyCount++;
                        }
                    }

                    console.log(require('process').memoryUsage().rss / 1000 / 1000 + 'M');
                    callback(null);
                });
        }, (err, result) => {
            if (err) {
                reject();
            }
            else {
                console.log(emptyCount);
                resolve();
            }
        });
    });
};