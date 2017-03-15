import superAgent from 'superagent';
import cheerio from 'cheerio';
import { mapLimit } from 'async';
import { saveData } from  './database';
import config from '../config';

import * as logs from './functions/logs';
import getAnswer from './functions/getAnswer';
import getQuestion from './functions/getQuestion';
import getInformation from './functions/getInformation';
import getBgImage from './functions/getBgImage';
import getOtherData from './functions/getOtherData';


/*
 * @array: 数组
 */
export default (array) => {
    return new Promise((resolve, reject) => {

        let failArray = [],         // 存放请求失败的 id
            notSudokuCount = 0,     // 请求成功但是没有题目的数量
            concurrencyCount = 0;   // 并发数

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

                        // 输出错误信息日志
                        logs.formatMessage({
                            type: 'ERROR',
                            action: '抓取失败',
                            concurrencyCount: concurrencyCount,
                            id: id,
                            errorMessage: err.toString()
                        });
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

                            // 获取背景图片地址
                            const sudokuBgFilename = await getBgImage($, id, sudokuType);

                            // 获取其他数据
                            const sudokuOtherData = getOtherData($, sudokuType);

                            // 输出日志
                            config.log && logs.formatMessage({
                                type: 'INFO',
                                action: '正在抓取',
                                concurrencyCount: concurrencyCount,
                                sId: id,
                                sType: sudokuType
                            });


                            // 将数据插入数据库
                            await saveData({
                                sid: id.toString(),
                                question: sudokuQuestion,
                                answer: sudokuAnswer,
                                type_name: sudokuType,
                                level: sudokuLevel.toString(),
                                background_name: sudokuBgFilename,
                                other_data: sudokuOtherData
                            })
                                .then(() => {

                                    // 输出日志
                                    config.log && logs.formatMessage({
                                        type: 'SUCCESS',
                                        action: '插入成功',
                                        concurrencyCount: concurrencyCount,
                                        sId: id,
                                        sType: sudokuType
                                    });
                                })
                                .catch(err => {

                                    // 输出错误信息日志
                                    logs.formatMessage({
                                        type: 'ERROR',
                                        action: '插入失败',
                                        concurrencyCount: concurrencyCount,
                                        sId: id,
                                        sType: sudokuType,
                                        errorMessage: err.errors[0].message
                                    });
                                });

                            // 重置数量
                            notSudokuCount = 0;
                        }
                        else {
                            notSudokuCount++;
                        }
                    }

                    // 并发数计数器反向 +1s
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

                // 输出错误信息日志
                logs.formatMessage({
                    type: 'ERROR',
                    action: '出现错误',
                    sId: failArray.join()
                });

                reject(err);
            }
            else {
                resolve(failArray);
            }
        });
    });
};