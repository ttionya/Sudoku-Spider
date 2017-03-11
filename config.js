export default {

    host: 'http://www.oubk.com/',

    // 待爬取的 URL，变量用 {{SUDOKU}} 替代
    url: 'http://www.oubk.com/sudoku/{{SUDOKU}}.html',

    // 数据库相关，仅支持 MySQL 数据库
    database: {
        host: 'localhost',
        port: 3306,
        database: 'sudoku',
        username: 'root',
        password: 'ttionya',

        /*
         * 此为 mysqli/mysql 的原生属性
         * 常见于开启了 skip-networking 选项，使 MySQL 不监听指定端口，而是用 Unix socket 进行连接
         * 此时可以设置 socketPath: 'sock file path'
         * 设置 socketPath 后，host 和 port 字段都将无效
         */
        dialectOptions: {
            socketPath: '/tmp/mysql.sock'
        },

        // 强制重建数据库
        // 注意：会删除所有数据
        forceCreate: true
    },


    // 对应数独见 ABOUT.md
    rules: [
        1,          // 数独、对角线数独
        5000001,    // 杀手数独、杀手对角数独
        10000001,   // 数比数独、数比对角数独
        15000001,   // 窗口数独
        20000001,   // 数比杀手数独、数比对角杀手数独
        30000001,   // 连续数独
        40000001,   // VX数独
        45000001,   // 17数数独
        50000001,   // 摩天楼数独
        52000001    // 外提示数独
    ],

    // 每种数独最大 Id
    // 只会探查 i ~ i + maxPerSudokuId 范围内的数独
    // 建议 100w 即可
    maxPerSudokuId: 10,

    // 连续未探查到多少数独则切换到下一个数独种类
    // 不宜过大，否则会有很多无用请求
    notSudokuLimitCount: 100,

    // 并发数，过高会被当作攻击，建议 20 - 30
    limit: 5,


    // 打印执行的 SQL 语句
    // 注意：开启会影响性能
    SQLLog: false,

    // 打印日志
    // 包含当前请求数、当前数独信息、内存使用情况
    // 注意：开启会影响性能
    log: true
}