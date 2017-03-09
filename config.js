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

    rules: [1]
}