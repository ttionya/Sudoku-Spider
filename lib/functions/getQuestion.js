// import * as logInfo from './getLogInformation';


export default $ => {
    let sudokuQuestion = [];

    for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
            sudokuQuestion.push($('#k' + j.toString() + 's' + i.toString()).val() || 0);
        }
    }
    sudokuQuestion = sudokuQuestion.join('');

    // console.log(logInfo.normalMessage('题目是：') + logInfo.normalGMessage(sudokuQuestion));

    return sudokuQuestion;
};