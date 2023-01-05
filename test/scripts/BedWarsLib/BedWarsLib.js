import { log, mc, int, overworld, runCommand, world, getScore, color_format2, text_format, Timer } from "../DefineLib/DefineLib"
import { File } from "../FileLib/FileLib"
import tick from "../server-plus/tick"
import * as gt from "@minecraft/server-gametest"

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
        if(Timer.getRest("Begin") <= 15){
            who.teleport(new mc.Vector(int(pos[0]) + 0.5, int(pos[1]), int(pos[2]) + 0.5), overworld, 0, 90)
            who.tell("§2游戏已开始,您将观战")
            who.runCommandAsync(`gamemode spectator @s`)
            return
        }
        who.runCommandAsync(`gamemode 0 @s`)
        who.teleport(new mc.Vector(int(pos[0]) + 0.5, int(pos[1]), int(pos[2]) + 0.5), overworld, 0, 90)
        runCommand(`clear "${who.name}"`)
        const nowPersons = world.scoreboard.getObjective("BedWars").getParticipants().find((find) => { return find.displayName == "Count" }) == undefined ? 0 : world.scoreboard.getObjective("BedWars").getScore(world.scoreboard.getObjective("BedWars").getParticipants().find((find) => { return find.displayName == "Count" }))
        runCommand(`scoreboard players set "Count" BedWars ${nowPersons + 1}`)
        File.writeLine("BedWars/Starting/1-1.map", who.name, false)
        File.readFrom("BedWars/Starting/1-1.map").split('\n').forEach((name) =>{
            const player = Array.from(world.getPlayers({"name":name}))[0]
            if(player == undefined) return
            player.tell(who.name + `加入了游戏(${File.readFrom("BedWars/Starting/1-1.map").split('\n').length}/16)`)
        })
        if(File.readFrom("BedWars/Starting/1-1.map").split('\n').length == 2) Timer.addTimer("BeginTime",30)
        if(File.readFrom("BedWars/Starting/1-1.map").split('\n').length == 4 && Timer.getRest("BeginTime") >= 10) Timer.addTimer("BeginTime",10)
    },
    FinishMap(){

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
        File.filter("BedWars/Starting/1-1.map",who)
        const pos = File.readFrom("BedWars/lobby/location.pos").split(' ')
        const x = getScore("tp_x", who) != undefined ? getScore("tp_x", who) : int(pos[0])
        const y = getScore("tp_y", who) != undefined ? getScore("tp_y", who) : int(pos[1])
        const z = getScore("tp_z", who) != undefined ? getScore("tp_z", who) : int(pos[2])
        const player = Array.from(world.getPlayers({ "name": who }))[0]
        player.runCommandAsync(`gamemode 0 @s`)
        player.teleport(new mc.Vector(x, y, z), overworld, 0, 90)
        player.nameTag = player.name
    }
}
tick.subscribe(() => {
    if (!File.inited || !File.exsits("BedWars/lobby/location.pos")) return
    Array.from(world.getPlayers()).forEach((each) => {
        if (!File.exsits(`players/${each.name}.txt`)) {
            BedWars.hub(each.name)
            File.touch(`players/${each.name}.txt`)
        }
    })
})
if (!world.scoreboard.getObjective("BedWars")) world.scoreboard.addObjective("BedWars", "BedWars")
if (!world.scoreboard.getObjective("KillCount")) world.scoreboard.addObjective("KillCount", "KillCount")

///// 击杀资源转移 /////
/**
 * 
 * @param {mc.Player} from 
 * @param {mc.Player | gt.SimulatedPlayer} to 
 */
function ResourceMove(from, to) {
    var all = {}
    for (var i = 0; i < 36; ++i) {
        if (from.getComponent("minecraft:inventory").container.getItem(i) == undefined) continue
        const item = from.getComponent("minecraft:inventory").container.getItem(i)
        all[item.typeId] = ((all[item.typeId] == undefined) ? item.amount : all[item.typeId] + item.amount)
    }
    ["minecraft:iron_ingot", "minecraft:gold_ingot", "minecraft:emerald", "minecraft:diamond"].forEach((each, index) => {
        if (all[each] != undefined) {
            to.runCommandAsync(`give @s ${each} ${all[each]}`)
            to.tell("  " + color_format2[each] + "+" + all[each] + text_format[each])
        }
    })
    // if (all["minecraft:gold_ingot"] != undefined) to.getComponent("minecraft:inventory").container.addItem(new mc.ItemStack(mc.MinecraftItemTypes.goldIngot, all["minecraft:gold_ingot"]))
    // if (all["minecraft:emerald"] != undefined) to.getComponent("minecraft:inventory").container.addItem(new mc.ItemStack(mc.MinecraftItemTypes.emerald, all["minecraft:emerald"]))
    // if (all["minecraft:diamond"] != undefined) to.getComponent("minecraft:inventory").container.addItem(new mc.ItemStack(mc.MinecraftItemTypes.diamond, all["minecraft:diamond"]))
}

world.events.entityHurt.subscribe((hurt) => {
    if (hurt.hurtEntity.getComponent('minecraft:health').current > 0) {
        if (hurt.damagingEntity == undefined) return
        if (hurt.damagingEntity.getComponent("minecraft:inventory") == undefined) return
        File.writeTo(`BedWars/hurt/${hurt.hurtEntity.name}.config`, hurt.damagingEntity.name)
        return
    }
    const name = File.readFrom(`BedWars/hurt/${hurt.hurtEntity.name}.config`)
    if (name == null) {
        hurt.hurtEntity.runCommandAsync(`clear @s`)
        return
    }
    if (hurt.hurtEntity.getComponent("minecraft:inventory") == undefined) return
    if (hurt.damagingEntity == undefined) {
        const player = Array.from(world.getPlayers({ "name": name }))[0]
        ResourceMove(hurt.hurtEntity, player)
        player.runCommandAsync("scoreboard players add @s KillCount 1")
        player.runCommandAsync(`playsound "random.orb"`)
    }
    else {
        ResourceMove(hurt.hurtEntity, hurt.damagingEntity)
        hurt.damagingEntity.runCommandAsync("scoreboard players add @s KillCount 1")
        hurt.damagingEntity.runCommandAsync(`playsound "random.orb"`)
    }
    File.delete(`BedWars/hurt/${hurt.hurtEntity.name}.config`)
    hurt.hurtEntity.runCommandAsync(`clear @s`)
})

///// 血量显示 /////
tick.subscribe(() => {
    Array.from(world.getPlayers()).forEach((player) => { player.nameTag = player.name + '\n当前血量 : §4' + player.getComponent("minecraft:health").current.toFixed().toString() })
})
for (var i in world.events) log(i)
world.events.playerSpawn.subscribe((spwan) => {
    if (spwan.initialSpawn) BedWars.hub(spwan.player.name)
})

world.events.itemUseOn.subscribe((use) => {
    if ([[1, 3, -1], [1, 3, -2]].find((find) => { return find[0] == use.blockLocation.x && find[1] == use.blockLocation.y && find[2] == use.blockLocation.z }) != undefined) BedWars.JoinMap(use.source)
})

world.events.entityHit.subscribe((hit) => {
    if (hit.hitBlock == undefined) return
    if ([[1, 3, -1], [1, 3, -2]].find((find) => { return find[0] == hit.hitBlock.location.x && find[1] == hit.hitBlock.location.y && find[2] == hit.hitBlock.location.z }) != undefined) BedWars.JoinMap(hit.entity)
})

///// 假人 /////

gt.register("Test", "test", (test) => {
    test.spawnSimulatedPlayer(new mc.BlockLocation(0, -50, 0), "Test", mc.GameMode.creative)
}).maxTicks(2147483647)
export { BedWars }