# Sudoku Spider

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/ttionya/Sudoku-Spider/master/LICENSE)

[欧泊颗数独](http://oubk.com)是一个很棒的数独网站，不仅题目多，而且难度也不低。最棒的是，该网站不仅有常规数独，还提供了比如杀手数独、数比数独等多种数独玩法。

于是做了一个爬虫专门用来爬它的数独。


## 运行环境

数独爬虫需要以下环境才能运行：

+ [Node.js](https://nodejs.org/en/) > 4
+ NPM (通常与 Node.js 一同安装)


## 使用方法

1. 安装依赖 `npm i`

2. 修改配置文件 `config.js`，配置选项见[配置](#配置)

3. 运行爬虫 `npm run start`

4. 清理文件夹，包括爬取的图片和生成的运行文件 `npm run clear`。**注意：会删除已爬取的图片**


## 说明

+ 只支持 MySQL 数据库
+ 未对 Windows 环境进行测试，理论上可以
+ 不会爬取 2x3 数独

## 配置

配置文件是根目录下的 `config.js`

+ `host`：欧泊颗数独的网址，默认为 `"http://www.oubk.com/"`
+ `url`：带变量 `{{SUDOKU}}` 的地址，爬虫将根据规则替换占位符，默认为 `http://www.oubk.com/sudoku/{{SUDOKU}}.html`
+ `database.host`：数据库主机名，默认为 `localhost`。若设置了 `socketPath` 则该配置项无效
+ `database.port`：数据库端口号，默认为 `3306`。若设置了 `socketPath` 则该配置项无效
+ `database.database`：数据库名
+ `database.username`：数据库用户名
+ `database.password`：数据库密码
+ `database.dialectOptions`：用于使用 [`mysqlijs/mysql`](https://github.com/mysqljs/mysql) 的原生属性，一般与 `socketPath` 一起使用  
当 MySQL 开启了 `skip-networking`，数据库将不对指定端口进行监听，只能通过 `Unix socket` 进行连接。`socketPath` 可以指定 `socket` 文件。
+ `database.forceCreate`：开启该选项后，每次爬数据前都会重建表
+ `rules`：爬取的数组，详见配置文件
+ `maxPerSudokuId`：爬虫只会爬取 `i ~ i + maxPerSudokuId` 范围内的数独，默认 `1,000,000`
+ `notSudokuLimitCount`：爬取到的页面连续多少个就终止爬取该类型，而切换到下一类型，默认 `200`
+ `limit`：爬虫的并发数，不宜太高，容易被当作攻击，建议 30 以内，默认为 `30`
+ `SQLLog`：开启 [`Sequelize.js`](https://github.com/sequelize/sequelize) 打印执行的 SQL 语句。开启会降低性能
+ `log`：打印日志，开启会降低性能


## License

Sudoku Spider 基于 [MIT](https://raw.githubusercontent.com/ttionya/Sudoku-Spider/master/LICENSE) 协议。  
Copyright © 2017, ttionya