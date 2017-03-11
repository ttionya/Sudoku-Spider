import superAgent from 'superagent';
import cheerio from 'cheerio';
import { mapLimit } from 'async';
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
                        console.error(err);
                    }
                    else {
                        let $ = cheerio.load(res.text);
                        let sudoku = [];

                        for (let i = 1; i < 10; i++) {
                            for (let j = 1; j < 10; j++) {
                                sudoku.push($('#k' + j + 's' + i).val() || 0);
                            }
                        }

                        let titleArr = $('title').text().split('#' + id.toString())[0].trim().split('-');

                        console.log($('#hid_aw').val()); // 这是答案
                        console.log(sudoku.join('')); // 这是题目
                        console.log(titleArr[0].trim()); // 这是类型
                        console.log(titleArr[1].trim()); // 这是难度

                        saveData({
                            sid: id,
                            question: sudoku.join(''),
                            answer: $('#hid_aw').val(),
                            type_name: titleArr[0].trim(),
                            level: 1
                        })
                            .then(() => {
                                //console.log(233);
                            })
                            .catch(err => {
                                console.log(err.code);
                            });
                    }
                    console.log(require('process').memoryUsage().rss / 1000 / 1000 + 'M');
                    
                    callback(null);
                });
        }, (err, result) => {
            "use strict";

            if (err) {
                reject();
            }
            else {
                resolve();
            }
        });

    })

};