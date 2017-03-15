import fs from 'fs';
import process from 'process';
import superAgent from 'superagent';
import * as logs from './logs';
import config from '../../config';


const dl = (url, id, filename, sudokuType) => {
    return new Promise((resolve, reject) => {

        superAgent.get(url)
            .set({
                'Accept': 'image/webp,image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Referer': 'http://www.oubk.com/sudoku/' + id.toString() + '.html',
                'Host': 'www.oubk.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36'
            })
            .end((err, result) => {
                if (err) {

                    // 输出错误信息日志
                    logs.formatMessage({
                        type: 'ERROR',
                        action: '下载失败',
                        sId: id,
                        sType: sudokuType,
                        message: url,
                        errorMessage: err.toString()
                    });

                    // 输出日志
                    logs.formatMessage({
                        type: 'WARN',
                        action: '重试下载',
                        sId: id,
                        sType: sudokuType,
                        message: url
                    });

                    // 重试直到成功
                    return dl(url, id, filename, sudokuType);
                }
                else {
                    fs.writeFile(filename, result.body, 'binary', (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {

                            // 输出日志
                            config.log && logs.formatMessage({
                                type: 'SUCCESS',
                                action: '下载完成',
                                sId: id,
                                sType: sudokuType,
                                message: url
                            });

                            resolve();
                        }
                    });
                }
            });
    });
};


export default ($, id, sudokuType) => {

    return new Promise((resolve, reject) => {

        // 只有杀手数独才有保存背景图片的必要
        if (sudokuType.indexOf('杀手') !== -1) {
            let url = config.host + $('.ptb').css('background-image').match(/url\("?([^")]*)"?\)/)[1],
                path = process.cwd(), // 执行脚本的绝对路径
                filename,
                tmpArr;

            // 计算文件名 id.ext
            tmpArr = url.split('.');
            filename = id.toString() + '.' + tmpArr[tmpArr.length - 1];

            // 输出日志
            config.log && logs.formatMessage({
                type: 'INFO',
                action: '正在下载',
                sId: id,
                sType: sudokuType,
                message: url
            });


            // 建立目录，否则报错
            try {
                fs.accessSync(path + '/images/')
            }
            catch (e) {
                fs.mkdirSync(path + '/images');
            }

            // 下载
            dl(url, id, path + '/images/' + filename, sudokuType)
                .then(() => resolve(filename))
                .catch(err => {

                    // 输出错误信息日志
                    logs.formatMessage({
                        type: 'ERROR',
                        action: '保存失败',
                        sId: id,
                        sType: sudokuType,
                        message: url,
                        errorMessage: err.message
                    });

                    process.exit(); // 下载还能出错？那就退出吧
                });
        }
        else {
            resolve('');
        }
    });
}