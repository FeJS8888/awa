import { log, mc, int, overworld, runCommand, world, getScore, color_format2, text_format, bed_location, bear_location, bed_location_reserve, bed_location_reserve2, bed_order_to_color } from "../DefineLib/DefineLib"
import { Timer } from "../TimerLib/TimerLib"
import { File } from "../FileLib/FileLib"
import tick from "../server-plus/tick"
import * as gt from "@minecraft/server-gametest"
import { replay } from "../replayLib/replayLib"

var BedWars = {
    /**
    * 
    * @param {mc.Player} who 
    */
    JoinMap(who) {
        if (who.hasTag("Joining")) return
        const posstr = File.readFrom("BedWars/MapLocs/1-1.map", false)
        if (posstr == undefined) {
            who.tell("No Map")
            return
        }
        who.addTag("Joining")
        Timer.addTimer(who.name, 1, () => { who.removeTag("Joining") })
        const pos = posstr.split(' ')
        if (Timer.getRest("BeginTime") <= 10) {
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
        File.readFrom("BedWars/Starting/1-1.map").split('\n').forEach((name) => {
            const player = Array.from(world.getPlayers({ "name": name }))[0]
            if (player == undefined) return
            player.tell(who.name + `加入了游戏(${File.readFrom("BedWars/Starting/1-1.map").split('\n').length}/16)`)
        })
        if (File.readFrom("BedWars/Starting/1-1.map").split('\n').length == 2) Timer.addTimer("BeginTime", 30)
        if (File.readFrom("BedWars/Starting/1-1.map").split('\n').length == 4 && Timer.getRest("BeginTime") >= 10) Timer.addTimer("BeginTime", 10)
    },
    FinishMap() {
        Timer.addTimer("BeginTime", 2147483647, () => { log("OUT") })
        File.delete("BedWars/Starting/1-1.map")
        Array.from(world.getPlayers()).forEach((each) => { each.runCommandAsync(`clearspwanpoint`); replay.replayPlace(each.name); each.getTags().forEach((tag) => { each.removeTag(tag) }) })
        for (var key in bed_location) runCommand(`setblock ${bed_location[key]} bed ${key}`)
        runCommand(`kill @e[type = item]`)
        world.scoreboard.removeObjective("tp_x")
        world.scoreboard.removeObjective("tp_y")
        world.scoreboard.removeObjective("tp_z")
        world.scoreboard.removeObjective("tp_facing_x")
        world.scoreboard.addObjective("tp_x", "tp_x")
        world.scoreboard.addObjective("tp_y", "tp_y")
        world.scoreboard.addObjective("tp_z", "tp_z")
        world.scoreboard.addObjective("tp_facing_x", "tp_facing_x")

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
    /**
     * 
     * @param {mc.Vector3 | mc.Location | mc.BlockLocation} pos 
     */
    inithub(pos) {
        File.writeTo("BedWars/lobby/location.pos", `${Math.floor(pos.x)} ${Math.floor(pos.y) + 1} ${Math.floor(pos.z)}`)
        log("§2初始化成功")
    },
    /**
     * 
     * @param {string} who 
     */
    tp_back(who) {
        const pos = File.readFrom("BedWars/lobby/location.pos").split(' ')
        const x = getScore("tp_x", who) != undefined ? getScore("tp_x", who) : int(pos[0])
        const y = getScore("tp_y", who) != undefined ? getScore("tp_y", who) : int(pos[1])
        const z = getScore("tp_z", who) != undefined ? getScore("tp_z", who) : int(pos[2])
        const facing = getScore("tp_facing_x", who) != undefined ? getScore("tp_facing_x", who) : 90
        const player = Array.from(world.getPlayers({ "name": who }))[0]
        player.teleport(new mc.Vector(x, y, z), overworld, 0, facing)
        log("TP " + who + " TO" + `${x} ${y} ${z}`)
    },
    /**
     * 
     * @param {string} who 
     */
    hub(who) {
        File.filter("BedWars/Starting/1-1.map", who)
        const pos = File.readFrom("BedWars/lobby/location.pos").split(' ')
        const x = int(pos[0])
        const y = int(pos[1])
        const z = int(pos[2])
        const facing = 90
        const player = Array.from(world.getPlayers({ "name": who }))[0]
        File.filter("BedWars/Starting/1-1.map", who)
        if (File.readFrom("BedWars/Starting/1-1.map") == "") if (File.exsits("BedWars/Starting/1-1.map")) this.FinishMap()
        else if (File.readFrom("BedWars/Starting/1-1.map").split('\n').length == 1) {
            log("§l§4人数不足,已停止倒计时")
            this.FinishMap()
        }
        player.runCommandAsync(`scoreboard players reset @s tp_x`)
        player.runCommandAsync(`scoreboard players reset @s tp_y`)
        player.runCommandAsync(`scoreboard players reset @s tp_z`)
        player.runCommandAsync(`scoreboard players reset @s tp_facing_x`)
        player.getTags().forEach((tag) => { player.removeTag(tag) })
        player.runCommandAsync(`gamemode 0 @s`)
        player.runCommandAsync(`replaceitem entity @s slot.hotbar 0 compass 1`)
        player.teleport(new mc.Vector(x, y, z), overworld, 0, facing)
        player.nameTag = player.name
    },
    /**
     * 
     * @param {mc.Player} player 
     */
    die(player) {
        if (player.getTags().find((find) => { return find.startsWith('BED>') }) == undefined) {
            player.runCommandAsync(`gamemode 0`)
            player.runCommandAsync(`title @s title 游戏结束`)
            player.runCommandAsync(`title @s subtitle 你的床已破坏,无法重生`)
            BedWars.hub(player.name)
            if (File.readFrom("BedWars/Starting/1-1.map") != undefined && File.readFrom("BedWars/Starting/1-1.map").split('\n').length == 1) {
                const player = File.readFrom("BedWars/Starting/1-1.map")
                Timer.addTimer(new Date().getTime().toString(), 5, () => { if (Array.from(world.getPlayers({ "name": player })).length == 1) BedWars.hub(player) })
                this.FinishMap()
            }
            return
        }
        player.runCommandAsync(`gamemode spectator`)
        BedWars.tp_back(player.name)
        player.runCommandAsync(`title @s title 你死了`)
        player.tell("你将在5秒后重生")
        Timer.addTimer(new Date().getTime().toString(), 1, () => {
            player.tell("你将在4秒后重生")
            Timer.addTimer(new Date().getTime().toString(), 1, () => {
                player.tell("你将在3秒后重生")
                Timer.addTimer(new Date().getTime().toString(), 1, () => {
                    player.tell("你将在2秒后重生")
                    Timer.addTimer(new Date().getTime().toString(), 1, () => {
                        player.tell("你将在1秒后重生")
                        Timer.addTimer(new Date().getTime().toString(), 1, () => {
                            player.runCommandAsync(`gamemode 0`)
                            BedWars.tp_back(player.name)
                            player.tell("已重生")
                        })
                    })
                })
            })
        })
    }
}
tick.subscribe(() => {
    if (mc.system.currentTick % 20 == 0) runCommand(`effect @e[type=villager] instant_health 1 255`);
    ["红床", "种子", "蒲公英", "玫瑰", "干海带方块"].forEach((name) => {
        Array.from(overworld.getEntities({ "type": "item", "name": name })).forEach((each) => { each.kill() })
    })
    if (mc.system.currentTick % 20 != 0) return
    if (Timer.getRest("BeginTime") == -114514) return
    if (Timer.getRest("BeginTime") == 5) {
        var count = 0
        var random = {}
        File.readFrom("BedWars/Starting/1-1.map").split('\n').forEach((each) => {
            do count = Math.floor(Math.random() * 10) % 4
            while (random[count.toString()] != undefined)
            random[count.toString()] = true
            log(count.toString())
            if (each == "") return
            log(each + " : " + count.toString() + " : " + bear_location[count.toString()][0] + " : " + bed_location[count.toString()] + " : " + bear_location[count.toString()][0].split(' ')[0])
            const player = Array.from(world.getPlayers({ "name": each }))[0]
            player.addTag("BED>" + bed_location[count.toString()])
            player.runCommandAsync(`scoreboard players set @s tp_x ${bear_location[count.toString()][0].split(' ')[0]}`)
            player.runCommandAsync(`scoreboard players set @s tp_y ${bear_location[count.toString()][0].split(' ')[1]}`)
            player.runCommandAsync(`scoreboard players set @s tp_z ${bear_location[count.toString()][0].split(' ')[2]}`)
            player.runCommandAsync(`scoreboard players set @s tp_facing_x ${bear_location[count.toString()][1]}`)
            player.runCommandAsync(`spwanpoint @s ${bear_location[count.toString()][0]}`)
        })
    }
    if (Timer.getRest("BeginTime") <= 6 && Timer.getRest("BeginTime") != 1) {
        File.readFrom("BedWars/Starting/1-1.map").split('\n').forEach((each) => {
            const player = Array.from(world.getPlayers({ "name": each }))[0]
            player.tell("§l游戏将在§e" + (Timer.getRest("BeginTime") - 1).toString() + "§r§l秒后开始")
            player.runCommandAsync(`title @s title §4${Timer.getRest("BeginTime") - 1}`)
        })
    }
    if (Timer.getRest("BeginTime") == 1) {
        File.readFrom("BedWars/Starting/1-1.map").split('\n').forEach((each) => {
            BedWars.tp_back(each)
            const player = Array.from(world.getPlayers({ "name": each }))[0]
            player.runCommandAsync(`title @s clear`)
            player.tell("§l已开始游戏")
        })
    }
})
if (!world.scoreboard.getObjective("BedWars")) world.scoreboard.addObjective("BedWars", "BedWars")
if (!world.scoreboard.getObjective("KillCount")) world.scoreboard.addObjective("KillCount", "KillCount")


world.events.beforeChat.subscribe((chat) => {
    if (chat.message.startsWith("bedwars.")) {
        chat.cancel = true
        const op = chat.message.substring(8)
        if (op == "init") BedWars.init(chat.sender.location)
        else if (op == "inithub") BedWars.inithub(chat.sender.location)
        else if (op == "hub") BedWars.hub(chat.sender.name)
        else if (op == "Preload") BedWars.Preload()
        else if (op.startsWith("addPreloadCmd->")) BedWars.addPreloadCmd(op.substring(15))
        else log("错误的参数>>§4" + op.split(' ')[0] + "§r<<")
    }
})

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

///// 回城 /////
world.events.playerSpawn.subscribe((spwan) => {
    if (spwan.initialSpawn) BedWars.hub(spwan.player.name)
})

///// 传送牌 /////
world.events.itemUseOn.subscribe((use) => {
    if ([[1, 3, -1], [1, 3, -2]].find((find) => { return find[0] == use.blockLocation.x && find[1] == use.blockLocation.y && find[2] == use.blockLocation.z }) != undefined) BedWars.JoinMap(use.source)
})

world.events.entityHit.subscribe((hit) => {
    if (hit.hitBlock == undefined) return
    if ([[1, 3, -1], [1, 3, -2]].find((find) => { return find[0] == hit.hitBlock.location.x && find[1] == hit.hitBlock.location.y && find[2] == hit.hitBlock.location.z }) != undefined) BedWars.JoinMap(hit.entity)
})

///// 假人 /////

gt.register("Test", "test", (test) => {
    const player = test.spawnSimulatedPlayer(new mc.BlockLocation(0, 0, 0), "Test", mc.GameMode.creative)
    player.giveItem(new mc.ItemStack(mc.MinecraftItemTypes.compass, 1, 0), true)
    player.useItem(new mc.ItemStack(mc.MinecraftItemTypes.compass, 1, 0))
}).maxTicks(2147483647)


///// 破床 /////

world.events.blockBreak.subscribe((br) => {
    if (br.brokenBlockPermutation.type.id != "minecraft:bed") return;
    var ret = false
    if (br.player.hasTag(`BED>${br.block.location.x} ${br.block.location.y} ${br.block.location.z}`)) {
        br.player.tell("§4你不能破坏你的床")
        runCommand(`setblock ${br.block.location.x} ${br.block.location.y} ${br.block.location.z} bed ${bed_location_reserve[`${br.block.location.x} ${br.block.location.y} ${br.block.location.z}`]}`)
        ret = true
    }
    else {
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach((each) => {
            if (br.player.hasTag(`BED>${br.block.location.x + each[0]} ${br.block.location.y} ${br.block.location.z + each[1]}`)) {
                br.player.tell("§4你不能破坏你的床")
                runCommand(`setblock ${br.block.location.x + each[0]} ${br.block.location.y} ${br.block.location.z + each[1]} bed ${bed_location_reserve[`${br.block.location.x + each[0]} ${br.block.location.y} ${br.block.location.z + each[1]}`]}`)
                ret = true
            }
        })
    }
    if (ret) return
    const which = (bed_location_reserve[`${br.block.location.x} ${br.block.location.y} ${br.block.location.z}`] != undefined) ? bed_location_reserve[`${br.block.location.x} ${br.block.location.y} ${br.block.location.z}`] : bed_location_reserve2[`${br.block.location.x} ${br.block.location.y} ${br.block.location.z}`]
    log("§l" + bed_order_to_color[which] + "队§r床已被破坏")
    runCommand(`tag @a remove "BED>${bed_location[which]}"`)
})

///// 防上床 /////

world.events.beforeItemUseOn.subscribe((use) => { if (overworld.getBlock(use.blockLocation).typeId == "minecraft:bed") use.cancel = true })

// ///// 防开其他队伍箱子 /////

// world.events.beforeItemUseOn.subscribe((use) =>{if(overworld.getBlock(use.blockLocation).typeId == "minecraft:chest") use.cancel = true})


///// 死亡机制 /////

///// 清除y<100 /////

tick.subscribe(() => {
    if (mc.system.currentTick % 20 != 0) return
    Array.from(world.getPlayers()).forEach((player) => {
        if (player.location.y > -100) return
        player.kill()
    })
})

///// 正常死亡 /////

world.events.entityHurt.subscribe((die) => {
    if (die.hurtEntity.getComponent('minecraft:inventory') == undefined) return
    if (die.hurtEntity.getComponent('minecraft:health').current > 0) return
    BedWars.die(die.hurtEntity)
})











export { BedWars }

BedWars.FinishMap()
// File.delete("BedWars/PreloadCmd/1-1.cmdconfig");
// ["structure load team1 1000 1 1039 180_degrees",
//     "structure load team1 961 1 1000 270_degrees",
//     "structure load team1 1000 1 961 0_degrees",
//     "structure load team1 1039 1 1000 90_degrees",
//     "structure load center1 1000 0 1000 0_degrees",
//     "structure load diamondisland1 963 16 1067 90_degrees",
//     "structure load diamondisland1 1067 16 963 270_degrees",
//     "structure load diamondisland1 963 16 963 180_degrees",
//     "structure load diamondisland1 1067 16 1067 0_degrees",
//     "structure load villager_items_1 1031 24 968 0_degrees",
//     "structure load villager_items_1 1078 24 1031 0_degrees",
//     "structure load villager_items_1 1015 24 1078 0_degrees",
//     "structure load villager_items_1 968 24 1015 0_degrees",
//     "structure load villager_items_2 1031 24 968 0_degrees",
//     "structure load villager_items_2 1078 24 1031 0_degrees",
//     "structure load villager_items_2 1015 24 1078 0_degrees",
//     "structure load villager_items_2 968 24 1015 0_degrees",
//     "structure load villager_upgrades 968 24 1031 0_degrees",
//     "structure load villager_upgrades 1015 24 968 0_degrees",
//     "structure load villager_upgrades 1078 24 1015 0_degrees",
//     "structure load villager_upgrades 1031 24 1078 0_degrees"].forEach((cmd) => { BedWars.addPreloadCmd(cmd) })