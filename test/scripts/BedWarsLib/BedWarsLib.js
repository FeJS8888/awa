import { log, mc, int, overworld, runCommand, world, getScore } from "../DefineLib/DefineLib"
import { File } from "../FileLib/FileLib"
import tick from "../server-plus/tick"
import playerJoined from "../server-plus/playerJoined"

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
        File.writeTo("BedWars/MapLocs/1-1.map", `${Math.floor(pos.x)} ${Math.floor(pos.y) + 1} ${Math.floor(pos.z)}`)
        log("§2初始化成功")
    },
    Preload() {
        File.readFrom("BedWars/PreloadCmd/1-1.cmdconfig").split('\n').forEach((cmd) => { log(cmd); runCommand(cmd) })
        log("OK")
    },
    /**
     * 
     * @param {string} cmd 
     */
    addPreloadCmd(cmd) {
        File.writeLine("BedWars/PreloadCmd/1-1.cmdconfig", cmd)
        log("OK")
    },
    inithub(pos) {
        File.writeTo("BedWars/lobby/location.pos", `${Math.floor(pos.x)} ${Math.floor(pos.y) + 1} ${Math.floor(pos.z)}`)
        log("§2初始化成功")
    },
    /**
     * 
     * @param {string} who 
     */
    hub(who) {
        const pos = File.readFrom("BedWars/lobby/location.pos").split(' ')
        const x = getScore("tp_x", who) != undefined ? getScore("tp_x", who) : int(pos[0])
        const y = getScore("tp_y", who) != undefined ? getScore("tp_y", who) : int(pos[1])
        const z = getScore("tp_z", who) != undefined ? getScore("tp_z", who) : int(pos[2])
        const player = Array.from(world.getPlayers({ "name": who }))[0]
        player.teleport(new mc.Vector(x, y, z), overworld, 0, 90)
        player.nameTag = player.name
    }
}
world.events.playerJoin.subscribe((join) => { File.delete(`players/${join.playerName}.txt`) })
tick.subscribe(() => {
    if(!File.inited || !File.exsits("BedWars/lobby/location.pos")) return
    Array.from(world.getPlayers()).forEach((each) => {
        if (!File.exsits(`players/${each.name}.txt`)) {
            BedWars.hub(each.name)
            File.touch(`players/${each.name}.txt`)
        }
    })
})
if (!world.scoreboard.getObjective("BedWars")) world.scoreboard.addObjective("BedWars", "BedWars")

export { BedWars }