import "babel-polyfill";
import superAgent from 'superagent';
import cheerio from 'cheerio';
import { mapLimit } from 'async';
import config from './config';


import './lib/create_table';
// let array = [];
// for (let i = 1; i <= 2000000; i++) {
//     array.push(i);
// }
//
// mapLimit(array, 2, function (id, callback) {
//     superAgent.get(config.url.replace('{{SUDOKU}}', id.toString()))
//         .end((err, res) => {
//             if (err) {
//                 console.error(err);
//             }
//             else {
//                 var $ = cheerio.load(res.text);
//                 let sudoku = [];
//
//                 for (let i = 1; i < 10; i++) {
//                     for (let j = 1; j < 10; j++) {
//                         sudoku.push($('#k' + j + 's' + i).val());
//                     }
//                 }
//
//                 console.log($('#hid_aw').val());
//                 console.log(sudoku.join());
//             }
//
//             if (id > 10) {
//                 callback(1);
//             }
//             else {
//                 callback(null);
//             }
//         });
// });