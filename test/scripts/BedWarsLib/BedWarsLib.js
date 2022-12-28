import { log, mc, int, overworld, runCommand, world } from "../DefineLib/DefineLib"
import { File } from "../FileLib/FileLib"

var BedWars = {
    /**
    * 
    * @param {mc.Player} who 
    */
    JoinMap(who) {
        const posstr = File.readFrom("BedWars/MapLocs/1-1.map", false)
        if (posstr == undefined) {
            who.tell("No Map")
            return
        }
        const pos = posstr.split(' ')
        who.teleport(new mc.Vector(int(pos[0]) + 0.5, int(pos[1]), int(pos[2]) + 0.5), overworld, 0, 90)
        runCommand(`clear "${who.name}"`)
        const nowPersons = world.scoreboard.getObjective("BedWars").getParticipants().find((find) => { return find.displayName == "Count" }) == undefined ? 0 : world.scoreboard.getObjective("BedWars").getScore(world.scoreboard.getObjective("BedWars").getParticipants().find((find) => { return find.displayName == "Count" }))
        runCommand(`scoreboard players set "Count" BedWars ${nowPersons + 1}`)
        File.writeLine("BedWars/Starting/1-1.map", who.name, false)
    },
    /**
     * 
     * @param {mc.Vector3} pos 
     */
    init(pos) {
        File.writeTo("BedWars/MapLocs/1-1.map", `${pos.x.toFixed()} ${pos.y.toFixed()} ${pos.z.toFixed()}`)
        log("§2初始化成功")
    },
    Preload() {
        File.readFrom("BedWars/PreloadCmd/1-1.cmdconfig").split('\n').forEach((cmd) => { log(cmd);runCommand(cmd)})
        log("OK")
    },
    /**
     * 
     * @param {string} cmd 
     */
    addPreloadCmd(cmd){
        File.writeLine("BedWars/PreloadCmd/1-1.cmdconfig",cmd)
        log("OK")
    }
}

export { BedWars }