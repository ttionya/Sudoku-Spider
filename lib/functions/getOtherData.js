import * as logInfo from './getLogInformation';


export default ($, sudokuType) => {

    // 任何杀手数独都不需要抓取数据
    if(sudokuType.indexOf('杀手') !== -1) {
        return '';
    }

    // 除杀手外的数比需要抓取对比数据
    else if (sudokuType.indexOf('') !== -1) {

        /*
         * 每一格有标记则先左侧后上侧
         * g1 => 左大
         * g2 => 右大
         * g3 => 上大
         * g6 => 下大
         *
         * {
         *     id: {
         *         position: 't' | 'r' | 'b' | 'l', // 方位
         *         bigger: 't' | 'r' | 'b' | 'l' // 哪里更大
         *     }
         * }
         */
        let data = { };

        for (let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                let id = 'k' + j.toString() + 's' + i.toString(),
                    cell = $('#' + id);

                cell.prev().attr('class');
                data.id = {
                    position: 1
                }
            }
        }
    }

    // console.log(logInfo.normalMessage('题目是：') + logInfo.normalGMessage(sudokuQuestion));

    return '';
};