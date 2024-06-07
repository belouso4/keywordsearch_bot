// import 'dotenv/config'
import { Telegraf, session, Markup, Scenes } from 'telegraf'
import User from '../../models/user.js';
import fs from 'fs'

const bot = new Telegraf(process.env.BOT_TOKEN)

export const filterMsg = async (updateInfo) => {

    try {
        let objnewmsg = updateInfo.updates.filter(updateInfo => updateInfo._ === 'updateNewChannelMessage')
        const user = await User.findOne({});
        const message = objnewmsg[0].message.message

        if (user.notify
            && user.channels.includes(updateInfo.chats[0].username)
            && searchKeywords(message, user.keywords)) {
            console.log('hadle');
            tgSendMsg(message, `https://t.me/${updateInfo.chats[0].username}/${objnewmsg[0].message.id}`)
        }

    } catch (error) { }
}

const tgSendMsg = (msg, link = null) => {
    let message = link ? msg + `\n\n` + link : msg;
    bot.telegram.sendMessage(process.env.ADMIN_TG_ID, message)
}

const searchKeywords = (txt, keywords) => {
    for (let index = 0; index < keywords.length; index++) {
        const regex = new RegExp(keywords[index].replace(/ /g, '.*'), 'g');

        if (txt.match(regex)) {
            return txt
        }
    }

    return false
}