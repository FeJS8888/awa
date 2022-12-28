import { Can_not_break_blocks, int, log, mc, overworld, world } from "../DefineLib/DefineLib";
import { File } from "../FileLib/FileLib";

if (!File.exsits("replay/isOpen.txt")) File.newfile("replay/isOpen.txt")

world.events.blockPlace.subscribe((pl) => { if (isOpen && Can_not_break_blocks.find((find) => { return "minecraft:" + find == pl.block.typeId }) == undefined) File.writeLine(`replay/place/${pl.player.name}.rep`, `${pl.block.location.x} ${pl.block.location.y} ${pl.block.location.z} ${pl.block.type.id}`) })
world.events.blockBreak.subscribe((pl) => { if (isOpen && Can_not_break_blocks.find((find) => { return "minecraft:" + find == pl.brokenBlockPermutation.type.id }) == undefined) File.writeLine(`replay/break/${pl.player.name}.rep`, `${pl.block.location.x} ${pl.block.location.y} ${pl.block.location.z} ${pl.brokenBlockPermutation.type.id}`) })

/**
 * 
 * @param {string} who 
 */
function replayPlace(who) {
    const all = File.readFrom(`replay/place/${who}.rep`)
    if (!all) log("§4未找到记录")
    else {
        var count = 0
        all.split('\n').forEach((each) => {
            if (each == "") return
            const pos = each.split(' ')
            overworld.getBlock(new mc.BlockLocation(int(pos[0]), int(pos[1]), int(pos[2]))).setType(mc.MinecraftBlockTypes.air)
            count++
        })
        File.delete(`replay/place/${who}.rep`)
        log(`§2回放成功${count}条记录`)
    }
}
/**
 * 
 * @param {string} who 
 */
function replayBreak(who) {
    const all = File.readFrom(`replay/break/${who}.rep`)
    if (!all) log("§4未找到记录")
    else {
        var count = 0
        all.split('\n').forEach((each) => {
            if (each == "") return
            const pos = each.split(' ')
            overworld.getBlock(new mc.BlockLocation(int(pos[0]), int(pos[1]), int(pos[2]))).setType(mc.MinecraftBlockTypes[pos[3].substring(10)])
            count++
        })
        File.delete(`replay/break/${who}.rep`)
        log(`§2回放成功${count}条记录`)
    }
}

function replayClose() {
    File.writeTo("replay/isOpen.txt", "0")
    isOpen = false
}

function replayOpen() {
    File.writeTo("replay/isOpen.txt", "1")
    isOpen = true
}

var isOpen = int(File.readFrom("replay/isOpen.txt")) != 0
log(isOpen.toString())

export { replayPlace, replayBreak, isOpen, replayOpen, replayClose }