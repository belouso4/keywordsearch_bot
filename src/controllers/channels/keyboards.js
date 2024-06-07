import { Markup } from 'telegraf';

export const channelsKeyboards = (channels) => {
    let btns = []
    let row = [];

    for (let i = 0; i < channels.length; i++) {
        row.push({ text: channels[i], callback_data: 'channelId_' + i, hide: false });
        if ((i + 1) % 2 === 0 || i === channels.length - 1) {
            btns.push(row);
            row = [];
        }
    }

    btns.push([
        Markup.button.callback('Отменить❌', 'cancelRemoving'),
        Markup.button.callback('Сохранить✅', 'saveRemoving')
    ])
    return btns
}