import { Markup, Scenes } from 'telegraf'
import { message } from 'telegraf/filters'

import User from '../../models/user.js';

import { exampleTextChannels, startPrint } from '../../utils/printText.js'
// import { btnChannels } from '../buttons/channels.js';
import { startKeyboard } from '../start/keyboards.js';
import { channelsKeyboards } from './keyboards.js';

const channelsScene = new Scenes.BaseScene('channels-scene');
const userId = (ctx) => ctx.update.callback_query?.from?.id || ctx.from.id

channelsScene.enter(async (ctx) => {
    ctx.session.channels = []
    ctx.session.channelsInit = []
    await ctx.reply(
        'Вы можете добавить/удалить каналы и чаты, в которых бот будет осуществлять поиск.',
        Markup.inlineKeyboard([
            Markup.button.callback('Удалить', 'delete'),
            Markup.button.callback('Добавить новые', 'add'),
        ])
    )
    await ctx.answerCbQuery()
});

channelsScene.action('add', async ctx => {
    await ctx.editMessageText(exampleTextChannels(), Markup.inlineKeyboard([
        Markup.button.callback('Отменить❌', 'cancelAdding'),
        Markup.button.callback('Сохранить✅', 'saveAdding')
    ]))

    await ctx.answerCbQuery()
})

channelsScene.action('delete', async ctx => {
    let user = await User.findOne({})
    ctx.session.channelsInit = user.channels
    await ctx.editMessageText(
        'Для удаления кликните на каналы, что хотите удалить и нажмите “Сохранить”',
        Markup.inlineKeyboard(channelsKeyboards(user.channels))
    )
})

channelsScene.action(['cancelAdding', 'saveAdding'], async ctx => {
    const user = await User.findOne({ user_id: userId(ctx) });

    if ('cancelAdding' === ctx.callbackQuery.data) {
        ctx.session.channels = []
        await ctx.editMessageText(startPrint(user), {
            reply_markup: startKeyboard(false),
            parse_mode: 'Markdown'
        })
        return ctx.scene.leave()
    }

    user.channels.push(...ctx.session.channels);
    user.save()

    ctx.session.channels = []
    await ctx.editMessageText(startPrint(user), {
        reply_markup: startKeyboard(false),
        parse_mode: 'Markdown'
    })
    return ctx.scene.leave()
})

channelsScene.action(['cancelRemoving', 'saveRemoving'], async ctx => {
    const user = await User.findOne({ user_id: userId(ctx) });

    if ('cancelRemoving' === ctx.callbackQuery.data) {
        await ctx.editMessageText(startPrint(user), {
            reply_markup: startKeyboard(false),
            parse_mode: 'Markdown'
        })

        return ctx.scene.leave()
    }

    user.channels = ctx.session.channelsInit
    await user.save()

    await ctx.editMessageText(startPrint(user), {
        reply_markup: startKeyboard(false),
        parse_mode: 'Markdown'
    })
    return ctx.scene.leave()
})

channelsScene.command('start', async (ctx) => {
    let user = await User.findOne({ user_id: userId(ctx) });
    if (!user) user = await User.create({ user_id: userId(ctx) });

    await ctx.reply(startPrint(user), {
        reply_markup: startKeyboard(user.notify),
        parse_mode: 'Markdown'
    })
    return ctx.scene.leave()
})
channelsScene.on(message('text'), async ctx => {
    const channelRegex = ctx.message.text.match(/t\.me\/(.+)/);
    let nameChannel = channelRegex
        ? channelRegex[1]
        : ctx.message.text

    ctx.session.channels.push(nameChannel)
    await ctx.deleteMessage()
})

const regex = new RegExp(/^channelId_(.+)$/i)
channelsScene.action(regex, async ctx => {
    let id = ctx.callbackQuery.data.split('_')[1]
    ctx.session.channelsInit.splice(id, 1);

    await ctx.editMessageText(
        'Для удаления кликните на слова, что хотите удалить и нажмите “Сохранить”',
        Markup.inlineKeyboard(channelsKeyboards(ctx.session.channelsInit))
    )
})


export default channelsScene
