import "babel-polyfill";
import config from './config';

//import { saveData } from  './lib/database';
import { request } from './lib/request';


(async () => {
    // await saveData();

    let array = [1, 2, 3];
    request(array);
})();