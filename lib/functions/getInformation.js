// import * as logs from './logs';


export default ($, id) => {
    let titleArr = $('title').text().split('#' + id.toString())[0].trim().split('-'),
        sudokuType = titleArr[0].trim(),
        sudokuLevel = titleArr[1].trim();

    // console.log(logs.bMessage('类型是：') + logs.gMessage(sudokuType));
    // console.log(logs.bMessage('难度是：') + logs.gMessage(sudokuLevel));

    // 转换难度为数字
    // 存在非以下字符的难度，此时 level 为 0
    const level = ['入门级', '初级', '中级', '高级', '骨灰级'];
    sudokuLevel = level.indexOf(sudokuLevel) + 1;

    return {
        sudokuType,
        sudokuLevel
    }
};