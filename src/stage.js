import { Scenes } from 'telegraf'
import startScene from './controllers/start/index.js';
import keywordsScene from './controllers/keywords/index.js';
import channelsScene from './controllers/channels/index.js';
import powerScene from './controllers/power/index.js';


const stage = new Scenes.Stage([
    startScene,
    keywordsScene,
    channelsScene,
    powerScene
]);

stage.action('cancel', async (ctx) => {
    // await ctx.reply('*Действие Отменено*', { parse_mode: 'Markdown' })
    // await ctx.reply('Главное меню', startKeyboard)
    // await ctx.scene.leave();
});

export default stage