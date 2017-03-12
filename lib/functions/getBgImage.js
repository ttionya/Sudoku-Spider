import fs from 'fs';
import process from 'process';
import superAgent from 'superagent';
import * as logInfo from './getLogInformation';
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
                    console.log(logInfo.memoryUsage()
                        + ' '
                        + logInfo.concurrencyCount('-')
                        + ' '
                        + logInfo.errorMessage('[下载错误]')
                        + ' '
                        + logInfo.normalYMessage('(' + id.toString() + ' ' + sudokuType + ')')
                        + ' '
                        + logInfo.normalGMessage('[' + url + ']')
                        + '\n'
                        + logInfo.errorMessage(err.toString())
                    );

                    console.log(logInfo.normalMessage('正在尝试重新下载...'));

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
                            config.log && console.log(logInfo.memoryUsage()
                                + ' '
                                + logInfo.concurrencyCount('-')
                                + ' '
                                + logInfo.normalGMessage('[保存成功]')
                                + ' '
                                + logInfo.normalYMessage('(' + id.toString() + ' ' + sudokuType + ')')
                                + ' '
                                + logInfo.normalGMessage('[' + url + ']')
                            );

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
                tmpArr,
                filename;

            // 计算文件名
            tmpArr = url.split('.');
            filename = id.toString() + '.' + tmpArr[tmpArr.length - 1];

            // 输出日志
            config.log && console.log(logInfo.memoryUsage()
                + ' '
                + logInfo.concurrencyCount('-')
                + ' '
                + logInfo.normalMessage('[开始下载]')
                + ' '
                + logInfo.normalYMessage('(' + id.toString() + ' ' + sudokuType + ')')
                + ' '
                + logInfo.normalGMessage('[' + url + ']')
            );


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
                    console.log(logInfo.memoryUsage()
                        + ' '
                        + logInfo.concurrencyCount('-')
                        + ' '
                        + logInfo.errorMessage('[保存错误]')
                        + ' '
                        + logInfo.normalYMessage('(' + id.toString() + ' ' + sudokuType + ')')
                        + ' '
                        + logInfo.normalGMessage('[' + url + ']')
                        + '\n'
                        + logInfo.errorMessage(err.message)
                    );

                    process.exit(); // 下载还能出错？那就退出吧
                });
        }
        else {
            resolve('');
        }
    });
}