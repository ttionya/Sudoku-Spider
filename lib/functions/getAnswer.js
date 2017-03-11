import chalk from 'chalk';


export default $ => {
    const sudokuAnswer = $('#hid_aw').val();

    // console.log(chalk.blue('答案是：') + chalk.green(sudokuAnswer));

    return sudokuAnswer;
};