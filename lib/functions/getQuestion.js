import chalk from 'chalk';


export default $ => {
    let sudokuQuestion = [];

    for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
            sudokuQuestion.push($('#k' + j + 's' + i).val() || 0);
        }
    }
    sudokuQuestion = sudokuQuestion.join('');

    // console.log(chalk.blue('题目是：') + chalk.green(sudokuQuestion));

    return sudokuQuestion;
};