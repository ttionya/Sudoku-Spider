import Sequelize from 'sequelize';
import config from '../config';


// 连接数据库
let sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    dialectOptions: config.database.dialectOptions,
    define: {
        engine: 'INNODB' // Default
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});


// 定义模型
let Sudoku = sequelize.define('sudoku', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sid: {
        type: Sequelize.STRING(10)
    },
    question: {
        type: Sequelize.CHAR(81)
    },
    answer: {
        type: Sequelize.CHAR(81)
    },
    background_url: {
        type: Sequelize.STRING(15)
    },
    other_data: {
        type: Sequelize.TEXT
    },
    level: {
        type: Sequelize.INTEGER.UNSIGNED
    },
    type_name: {
        type: Sequelize.STRING(20)
    }
}, {
    timestamps: false,
    freezeTableName: true,
    indexes: [
        {
            fields: ['sid'],
            unique: true
        }
    ]
});


// 同步数据
export default Sudoku.sync();