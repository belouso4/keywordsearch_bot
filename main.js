import 'dotenv/config'
import { start as setupBot } from './src/bot.js';
import MDBConnect from './mongodb.js';

(async function () {
    try {
        await MDBConnect();
        (await setupBot()).launch()
        console.log("</ Бот успешно запущен >")
    } catch (error) {
        console.log('Ошибка запуска: ', error)
        // console.log('Ошибка запуска: ')
    }

}())