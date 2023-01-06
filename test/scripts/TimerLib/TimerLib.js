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
    * @param {Function} then
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
        return ((getScore("Timer", displayName) == undefined) ? 0 : getScore("Timer", displayName))
    },
    /**
    * 
    * @param {string} displayName 
    */
    removeTimer(displayName) {
        runCommand(`scoreboard players reset "${displayName}" Timer`)
        if(this.functions[displayName] == undefined) return
        this.functions[displayName]()
        delete this.functions[displayName]
    }
}
if (!world.scoreboard.getObjective("Timer")) world.scoreboard.addObjective("Timer", "Timer")
world.scoreboard.getObjective("Timer").getParticipants().forEach((each) => { Timer.removeTimer(each.displayName) })

export {Timer}