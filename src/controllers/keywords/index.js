import { Composer, Markup, Scenes } from 'telegraf'
import { exampleTextKeywords, startPrint } from '../../utils/printText.js'

import User from '../../models/user.js';

import { keywordsKeyboards } from './keyboards.js';
import { startKeyboard } from '../start/keyboards.js';

const keywordsScene = new Scenes.BaseScene('keywords-scene');

keywordsScene.enter(async (ctx) => {
    ctx.session.keywords = []
    ctx.session.keywordsInit = []
    await ctx.reply(
        'Можно ввести слово, либо несколько слов, что должны присутствовать в сообщение, которое хотите получить.',
        Markup.inlineKeyboard([
            Markup.button.callback('Удалить', 'delete'),
            Markup.button.callback('Добавить новые', 'add'),
        ])
    )
    await ctx.answerCbQuery()
});


keywordsScene.action('add', async ctx => {
    await ctx.editMessageText(exampleTextKeywords(), Markup.inlineKeyboard([
        Markup.button.callback('Отменить❌', 'cancelAdding'),
        Markup.button.callback('Сохранить✅', 'saveAdding')
    ]))

    await ctx.answerCbQuery()
})

keywordsScene.action('delete', async ctx => {
    let user = await User.findOne({})
    ctx.session.keywordsInit = user.keywords
    await ctx.editMessageText(
        'Для удаления кликните на слова, что хотите удалить и нажмите “Сохранить”',
        Markup.inlineKeyboard(keywordsKeyboards(user.keywords))
    )
})

keywordsScene.action(['cancelAdding', 'saveAdding'], async ctx => {
    const user = await User.findOne({ user_id: ctx.getUserId() });

    if ('cancelAdding' === ctx.callbackQuery.data) {
        ctx.session.keywords = []
        await ctx.editMessageText(startPrint(user), {
            reply_markup: startKeyboard(false),
            parse_mode: 'Markdown'
        })
        return ctx.scene.leave()
    }

    user.keywords.push(...ctx.session.keywords);
    user.save()

    ctx.session.keywords = []
    await ctx.editMessageText(startPrint(user), {
        reply_markup: startKeyboard(false),
        parse_mode: 'Markdown'
    })
    return ctx.scene.leave()
})

keywordsScene.action(['cancelRemoving', 'saveRemoving'], async ctx => {
    const user = await User.findOne({ user_id: ctx.getUserId() });

    if ('cancelRemoving' === ctx.callbackQuery.data) {
        await ctx.editMessageText(startPrint(user), {
            reply_markup: startKeyboard(false),
            parse_mode: 'Markdown'
        })
        return ctx.scene.leave()
    }

    user.keywords = ctx.session.keywordsInit
    await user.save()

    await ctx.editMessageText(startPrint(user), {
        reply_markup: startKeyboard(false),
        parse_mode: 'Markdown'
    })
    return ctx.scene.leave()
})

keywordsScene.command('start', async (ctx) => {
    let user = await User.findOne({ user_id: ctx.getUserId() });
    if (!user) user = await User.create({ user_id: ctx.getUserId() });

    await ctx.reply(startPrint(user), {
        reply_markup: startKeyboard(user.notify),
        parse_mode: 'Markdown'
    })
    return ctx.scene.leave()
})

keywordsScene.on('message', async ctx => {
    let keywords = ctx.message.text.split(',')
    let arrayWords = keywords.map(function (item) {
        return item.trim();
    });

    ctx.session.keywords.push(...arrayWords)
    await ctx.deleteMessage()
})

const regex = new RegExp(/^keywordId_(.+)$/i)
keywordsScene.action(regex, async ctx => {
    let id = ctx.callbackQuery.data.split('_')[1]
    ctx.session.keywordsInit.splice(id, 1);

    await ctx.editMessageText(
        'Для удаления кликните на слова, что хотите удалить и нажмите “Сохранить”',
        Markup.inlineKeyboard(keywordsKeyboards(ctx.session.keywordsInit))
    )
})

export default keywordsScene
