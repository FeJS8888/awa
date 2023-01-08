import { getScore, mc, world, runCommand, int, log } from "../DefineLib/DefineLib"
import tick from "../server-plus/tick"

tick.subscribe(() => {
    world.scoreboard.getObjective("Timer").getParticipants().forEach((each) => { if (getScore("Timer", each.displayName) <= 0) Timer.removeTimer(each.displayName) })
    if (mc.system.currentTick % 20 == 0) {
        world.scoreboard.getObjective("Timer").getParticipants().forEach((each) => { runCommand(`scoreboard players remove "${each.displayName}" Timer 1`) })
    }
})
const Timer = {
    functions: {},
    /**
    * 
    * @param {string} displayName 
    * @param {number} time 
    * @param {Function | undefined} then
    */
    addTimer(displayName, time, then) {
        runCommand(`scoreboard players set "${displayName}" Timer ${time}`)
        this.functions[displayName] = then
    },
    /**
    * 
    * @param {string} displayName 
    */
    getRest(displayName) {
        return ((getScore("Timer", displayName) == undefined) ? -114514 : getScore("Timer", displayName))
    },
    /**
    * 
    * @param {string} displayName 
    */
    removeTimer(displayName) {
        runCommand(`scoreboard players reset "${displayName}" Timer`)
        if (this.functions[displayName] == undefined) return
        this.functions[displayName]()
        delete this.functions[displayName]
    }
}
if (!world.scoreboard.getObjective("Timer")) world.scoreboard.addObjective("Timer", "Timer")
world.scoreboard.getObjective("Timer").getParticipants().forEach((each) => { Timer.removeTimer(each.displayName) })

world.events.beforeChat.subscribe((chat) => {
    if (chat.message.startsWith("Timer.")) {
        chat.cancel = true
        const op = chat.message.substring(6)
        if (op.startsWith("add ")) Timer.addTimer(op.split(' ')[1], int(op.split(' ')[2]), function () { runCommand(`${op.substring(op.split(' ')[0].length + op.split(' ')[1].length + op.split(' ')[2].length + 3)}`)})
    }
})
export { Timer }