import { Markup } from 'telegraf';

export const keywordsKeyboards = (keywords) => {
    let btns = []
    let row = [];

    for (let i = 0; i < keywords.length; i++) {
        row.push({ text: keywords[i], callback_data: 'keywordId_' + i, hide: false });
        if ((i + 1) % 2 === 0 || i === keywords.length - 1) {
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