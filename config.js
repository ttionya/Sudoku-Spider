export default {

    // 待爬取的 URL，变量用 {{SUDOKU}} 替代
    url: 'http://oubk.com/sudoku/{{SUDOKU}}.html',

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
        }
    },

    // 对应数独见 ABOUT.md
    rules: [
        1,
        5000001,
        10000001,
        15000001,
        20000001,
        30000001,
        40000001,
        45000001,
        50000001,
        52000001
    ],

    // 并发数，过高会被当作攻击，建议 20 - 30
    limit: 5,

    // 打印 SQL 语句的日志
    SQLLog: true
}