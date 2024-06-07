import { Markup } from 'telegraf';

export const startKeyboard = (status) => {
    return {
        inline_keyboard: status ? [
            [Markup.button.callback('Остановить', 'power')]
        ] : [
            [
                Markup.button.callback('Каналы', 'channels'),
                Markup.button.callback('Слова', 'words')
            ],
            [Markup.button.callback('Запустить', 'power')]
        ]
    }
}