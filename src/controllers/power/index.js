import { Scenes } from "telegraf"
import User from "../../models/user.js";
import { startKeyboard } from "../start/keyboards.js";
import { startPrint } from "../../utils/printText.js";

const powerScene = new Scenes.BaseScene('power-scene')

powerScene.enter(async (ctx) => {
    const user = await User.findOne({ user_id: ctx.getUserId() });

    user.notify = !user.notify
    user.save()

    await ctx.editMessageText(startPrint(user), {
        reply_markup: startKeyboard(user.notify),
        parse_mode: 'Markdown'
    })
})

export default powerScene