// import * as logInfo from './getLogInformation';


export default $ => {
    const sudokuAnswer = $('#hid_aw').val();

    // console.log(logInfo.normalMessage('答案是：') + logInfo.normalGMessage(sudokuAnswer));

    return sudokuAnswer;
};