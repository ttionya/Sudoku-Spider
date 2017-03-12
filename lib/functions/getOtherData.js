import * as logInfo from './getLogInformation';


export default ($, sudokuType) => {
    let data = { };

    // 任何杀手数独都不需要抓取数据
    if(sudokuType.indexOf('杀手') !== -1) {
        data = '';
    }

    // 除杀手数独类外的数比数独需要抓取数据
    else if (sudokuType.indexOf('数比') !== -1) {

        const getDirection = className => {
            className = className.replace(/.*(g[1236]).*/, '$1');

            switch (className) {
                case 'g1':
                    return 'l';
                    break;

                case 'g2':
                    return 'r';
                    break;

                case 'g3':
                    return 't';
                    break;

                case 'g6':
                    return 'b';
                    break;

                default:
                    return null;
            }
        };

        /*
         * 每一格有标记则先左侧后上侧
         * g1 => 左大
         * g2 => 右大
         * g3 => 上大
         * g6 => 下大
         *
         * {
         *     id: {
         *         left: null | 'r' | 'l'
         *         top: null | 't' | 'b'
         *     }
         * }
         */

        for (let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                let id = 'k' + j.toString() + 's' + i.toString(),
                    cell = $('#' + id);

                const leftClassName = cell.prev().prev().attr('class'),
                    topClassName = cell.prev().attr('class');

                // 如果存在
                if (topClassName || leftClassName) {
                    data[id] = {
                        left: getDirection(leftClassName),
                        top: getDirection(topClassName)
                    }
                }
            }
        }
    }

    // 其他
    else {
        data = '';
    }

    console.log(logInfo.normalMessage('数据是：') + logInfo.normalGMessage(JSON.stringify(data)));

    data = data && JSON.stringify(data);
    return data;
};