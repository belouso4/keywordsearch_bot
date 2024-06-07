import 'dotenv/config'
import { Scenes, session, Telegraf } from 'telegraf';
import express from 'express';

import { adminMiddleware } from './middleware.js'
import stage from './stage.js'
import { startWatcker } from './services/watcher/tgparse.js';

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`listening port ${PORT}`);
});

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(session())
bot.use(stage.middleware());
bot.use(adminMiddleware)

bot.context.getUserId = function () {
  return this.update.callback_query?.from?.id || this.from.id
}

/* -------------------------- bot events --------------------------- */

bot.command('start', async (ctx) => await ctx.scene.enter('start-scene'))

bot.action('words', async ctx => await ctx.scene.enter('keywords-scene'))
bot.action('channels', async ctx => await ctx.scene.enter('channels-scene'))
bot.action('power', async ctx => await ctx.scene.enter('power-scene'))

startWatcker()

export async function start() {
  await bot.launch();
}

