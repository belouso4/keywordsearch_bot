import { Scenes } from "telegraf"
import { startKeyboard } from "./keyboards.js"
import User from "../../models/user.js";
import { startPrint } from "../../utils/printText.js";

const startScene = new Scenes.BaseScene('start-scene')

startScene.enter(async (ctx) => {
    const user = await User.findOneAndUpdate(
        { user_id: ctx.getUserId() },
        {
            $setOnInsert: {
                user_id: ctx.getUserId(),
            }
        },
        { new: true, upsert: true }
    );

    await ctx.reply(startPrint(user), {
        reply_markup: startKeyboard(user.notify),
        parse_mode: 'Markdown'
    })
})

export default startScene