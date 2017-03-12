// import * as logs from './logs';


/*
 * 数比数独
 *
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
const shuBi = ($, data) => {

    // 根据类名判断哪边大
    const getBigger = className => {
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
                tmpVal = getBigger(leftClassName);
                tmpVal && (data[id].left = tmpVal);

                // 上侧数据
                tmpVal = getBigger(topClassName);
                tmpVal && (data[id].top = tmpVal);
            }
        }
    }

    return data;
};


/*
 * VX数独
 *
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
const vx = ($, data) => {

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

    return data;
};


/*
 * 连续数独
 *
 * cT => 上侧
 * cL => 左侧
 *
 * {
 *     id: {
 *         left: null | 'y'
 *         top: null | 'y'
 *     }
 * }
 */
const lianXu = ($, data) => {

    // 判断方位
    const getPosition = className => {
        className = className.replace(/.*(c[TL]).*/, '$1');

        switch (className) {
            case 'cT':
            case 'cL':
                return className.split('')[1].toLowerCase(); // 't' | 'l'
                break;

            default:
                return null;
        }
    };

    for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
            let id = 'k' + j.toString() + 's' + i.toString(),
                cell = $('#' + id);

            (function calc(node) {
                node = node.prev(); // 取前一个 div

                let className = node.attr('class'),
                    tmpVal;

                // 没值就返回
                if (!className) {
                    return;
                }

                tmpVal = getPosition(className);

                // 存在
                if (tmpVal) {
                    !data[id] && (data[id] = { }); // 不存在则创建

                    tmpVal === 't' ? data[id].top = 'y' : data[id].left = 'y';
                }

                // 递归
                calc(node);
            })(cell);
        }
    }

    return data;
};


/*
 * 摩天楼数独
 *
 * 第二个：top
 * 第三个：left
 * 倒数第三个：right
 * 倒数第二个：bottom
 *
 * {
 *     top: 'xxxxxxxxx',
 *     right: 'xxxxxxxxx',
 *     bottom: 'xxxxxxxxx',
 *     left: 'xxxxxxxxx'
 * }
 */
const moTianLou = $ => {
    const tables = $('.pz').find('table'),
        tablesCount = tables.length,
        formatNum = table => {
            let num = '';

            table.find('td').each((index, item) => {
                num += $(item).text().trim() || 0;
            });

            return num;
        };

    return {
        top: formatNum(tables.eq(1)),
        right: formatNum(tables.eq(tablesCount - 3)),
        bottom: formatNum(tables.eq(tablesCount - 2)),
        left: formatNum(tables.eq(2))
    };
};


/*
 * 外提示数独
 *
 * 第二个：top
 * 第三个：left
 * 倒数第三个：right
 * 倒数第二个：bottom
 *
 * {
 *     top: 'xxxxxxxxx',
 *     right: 'xxxxxxxxx',
 *     bottom: 'xxxxxxxxx',
 *     left: 'xxxxxxxxx'
 * }
 */
const waiTiShi = $ => {
    const tables = $('table'),
        tablesCount = tables.length,
        formatNum = table => {
            let numArr = [];

            table.find('td').each((index, item) => {
                numArr.push(parseInt($(item).text().trim().replace(/\s/g, '') || 0));
            });

            return JSON.stringify(numArr);
        };

    return {
        top: formatNum(tables.eq(1)),
        right: formatNum(tables.eq(tablesCount - 3)),
        bottom: formatNum(tables.eq(tablesCount - 2)),
        left: formatNum(tables.eq(2))
    };
};


export default ($, sudokuType) => {
    let data = { };

    // 任何杀手数独都不需要抓取数据
    if(sudokuType.indexOf('杀手') !== -1) {
        data = '';
    }

    // 除杀手数独类外的数比数独需要抓取对比信息
    else if (sudokuType.indexOf('数比') !== -1) {
        data = shuBi($, data);
    }

    // VX数独需要抓取求和信息
    else if (sudokuType.indexOf('VX') !== -1) {
        data = vx($, data);
    }

    // 连续数独需要抓取临位信息
    else if (sudokuType.indexOf('连续') !== -1) {
        data = lianXu($, data);
    }

    // 摩天楼数独需要抓取外围信息
    else if (sudokuType.indexOf('摩天楼') !== -1) {
        data = moTianLou($);
    }

    // 外提示数独需要抓取外围信息
    else if (sudokuType.indexOf('外提示') !== -1) {
        data = waiTiShi($);
    }
    
    // 其他
    else {
        data = '';
    }

    // console.log(logs.bMessage('数据是：') + logs.gMessage(JSON.stringify(data)));

    data = data && JSON.stringify(data);
    return data;
};