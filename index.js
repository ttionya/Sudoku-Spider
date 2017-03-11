import "babel-polyfill";
import chalk from 'chalk';
import * as db from  './lib/database';
import { fetch } from './lib/fetch';
import config from './config';


let fetchWeb = async () => {
    await db.initDB();
    console.log(chalk.green('数据库建立完成\n'));

    let arr = [];
    for (let i = 1; i <= 100; i++) {
        arr.push(i)
    }

    let array = [1000000, 1000001, 1000002, 1000003, 1000004, 1000005, 1000006];
    await fetch(array);

};

fetchWeb()
    .then(() => console.log('Success!'))
    .catch(err => console.error(err.message));