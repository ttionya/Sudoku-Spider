import fs from 'fs';
import process from 'process';
import superAgent from 'superagent';
import chalk from 'chalk';
import mu from './getMemoryUsage';
import config from '../../config';


const dl = (url, id, filename) => {
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

                    console.error(chalk.red('下载图片遇到一些错误：' + err.toString()));

                    // 输出日志
                    config.log && console.log(chalk.blue(mu())
                        + ' '
                        + chalk.red('数独 ' + id.toString() + ' 的图片下载失败')
                    );

                    console.log(chalk.blue('正在尝试重新下载...'));

                    // 重新下载
                    return dl(url, id, filename);
                }
                else {
                    fs.writeFile(filename, result.body, 'binary', (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {

                            // 输出日志
                            config.log && console.log(chalk.blue(mu())
                                + ' '
                                + chalk.green('保存成功')
                                + ' '
                                + chalk.yellow('(' + id.toString() + ')')
                                + ' '
                                + chalk.green('[' + url + ']')
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
            config.log && console.log(chalk.blue(mu())
                + ' '
                + chalk.blue('开始下载')
                + ' '
                + chalk.yellow(sudokuType + ' (' + id.toString() + ')')
                + ' '
                + chalk.green('[' + url + ']')
            );


            // 建立目录
            try {
                fs.accessSync(path + '/images/')
            }
            catch (e) {
                fs.mkdirSync(path + '/images');
            }

            // 下载
            dl(url, id, path + '/images/' + filename)
                .then(() => resolve(filename))
                .catch(err => {
                    console.error(chalk.red('\n下载保存图片出现错误，错误原因：\n' + err.message));
                    process.exit(); // 下载还能出错？那就退出吧
                });
        }
        else {
            resolve('');
        }
    });
}