// import * as logs from './logs';


export default $ => {
    const sudokuAnswer = $('#hid_aw').val();

    // console.log(logs.bMessage('答案是：') + logs.gMessage(sudokuAnswer));

    return sudokuAnswer;
};