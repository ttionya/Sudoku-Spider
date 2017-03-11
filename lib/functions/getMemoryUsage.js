import process from 'process';


export default () => '[' + Math.round(process.memoryUsage().rss / 1000000).toString() + 'M]';