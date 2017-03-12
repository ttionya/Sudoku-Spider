import * as logInfo from './getLogInformation';


export default ($, sudokuType) => {
    let data = { };

    // 任何杀手数独都不需要抓取数据
    if(sudokuType.indexOf('杀手') !== -1) {
        data = '';
    }

    // 除杀手数独类外的数比数独需要抓取对比信息
    else if (sudokuType.indexOf('数比') !== -1) {

        // 根据类名判断哪边大
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

                const leftClassName = cell.prev().prev().attr('class') || '',
                    topClassName = cell.prev().attr('class') || '';

                // 如果存在
                if (topClassName || leftClassName) {
                    data[id] = { }; // 先初始化

                    let tmpVal;

                    // 左侧数据
                    tmpVal = getDirection(leftClassName);
                    tmpVal && (data[id].left = tmpVal);

                    // 上侧数据
                    tmpVal = getDirection(topClassName);
                    tmpVal && (data[id].top = tmpVal);
                }
            }
        }
    }

    // VX数独需要抓取求和信息
    else if (sudokuType.indexOf('VX') !== -1) {

        // 判断方位和值
        const getPosition = className => {
            className = className.replace(/.*(g[xv][LB]).*/, '$1');

            switch (className) {
                case 'gxB':
                case 'gvB':
                case 'gxL':
                case 'gvL':
                    let classNameArr = className.split('');

                    return {
                        position: classNameArr[2].toLowerCase(), // 'b' | 'l'
                        value: classNameArr[1]
                    };
                    break;

                default:
                    return null;
            }
        };

        /*
         * gxB => 下侧是 X
         * gvB => 下侧是 V
         * gxL => 右侧是 X
         * gvL => 右侧是 V
         *
         * 统一为与数比数独、连续数独一致的左上格式（原来为下右）
         *
         * {
         *     id: {
         *         left: null | 'x' | 'v'
         *         top: null | 'x' | 'v'
         *     }
         * }
         */

        for (let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                let id = 'k' + j.toString() + 's' + i.toString(),
                    cell = $('#' + id),
                    newId;

                (function calc(node) {
                    node = node.prev(); // 取前一个 div

                    let className = node.attr('class'),
                        tmpVal;

                    // 没值就返回
                    if (!className) {
                        return;
                    }

                    tmpVal = getPosition(className);

                    // 在原格子的下侧，则为下方格子的上侧
                    if (tmpVal && tmpVal.position === 'b') {
                        newId = 'k' + j.toString() + 's' + (i + 1).toString();

                        !data[newId] && (data[newId] = { }); // 不存在则创建

                        data[newId].top = tmpVal.value;
                    }

                    // 在原格子的右侧，则为右方格子的左侧
                    if (tmpVal && tmpVal.position === 'l') {
                        newId = 'k' + (j + 1).toString() + 's' + i.toString();

                        !data[newId] && (data[newId] = { }); // 不存在则创建

                        data[newId].left = tmpVal.value;
                    }

                    // 递归
                    calc(node);
                })(cell);
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