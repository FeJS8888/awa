import { Can_not_break_blocks, int, log, mc, overworld, world } from "../DefineLib/DefineLib";
import { File } from "../FileLib/FileLib";

if (!File.exsits("replay/isOpen.config")) File.touch("replay/isOpen.config")

world.events.blockPlace.subscribe((pl) => { if (replay.isOpen/* && Can_not_break_blocks.find((find) => { return "minecraft:" + find == pl.block.typeId }) == undefined*/) { var total = ""; const all = pl.block.permutation.getAllProperties(); all.forEach((each, index) => { total += (each.name + "->" + each.value + ((index < all.length - 1) ? ";" : "")) }); File.writeLine(`replay/place/${pl.player.name}.rep`, `${pl.block.location.x} ${pl.block.location.y} ${pl.block.location.z} ${pl.block.type.id} ${total}`) } })
world.events.blockBreak.subscribe((pl) => { if (replay.isOpen/* && Can_not_break_blocks.find((find) => { return "minecraft:" + find == pl.brokenBlockPermutation.type.id }) == undefined*/) { var total = ""; const all = pl.brokenBlockPermutation.getAllProperties(); all.forEach((each, index) => { total += (each.name + "->" + each.value + ((index < all.length - 1) ? ";" : "")) }); File.writeLine(`replay/break/${pl.player.name}.rep`, `${pl.block.location.x} ${pl.block.location.y} ${pl.block.location.z} ${pl.brokenBlockPermutation.type.id} ${total}`) } })

var replay = {
    /**
    * 
    * @param {string} who 
    */
    replayPlace(who) {
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
            File.move(`replay/place/${who}.rep`, `replay/Logger/cache/${this.currentOrder}.cache`)
            File.writeLine(`replay/Logger/cache/${this.currentOrder}.cache`, "place")
            this.currentOrder++
            File.writeTo("replay/Logger/currentOrder.config", this.currentOrder.toString())
            log(`§2回放成功${count}条记录`)
            log("§2cache创建成功,新的cache位于" + `§ereplay/Logger/cache/${this.currentOrder - 1}.cache`)
        }
    },
    /**
     * 
     * @param {string} who 
     */
    replayBreak(who) {
        const all = File.readFrom(`replay/break/${who}.rep`)
        if (!all) log("§4未找到记录")
        else {
            var count = 0
            all.split('\n').forEach((each) => {
                if (each == "") return
                const pos = each.split(' ')
                var permutation = mc.MinecraftBlockTypes[pos[3].substring(10) == "command_block" ? "commandBlock" : pos[3].substring(10)].createDefaultBlockPermutation()
                pos[4].split(';').forEach((each) => { permutation.getProperty(each.split('->')[0]).value = (each.split('->')[1] == "false" ? false : (each.split('->')[1] == "true" ? true : (int(each.split('->')[1]) != NaN ? int(each.split('->')[1]) : each.split('->')[1]))) })
                overworld.getBlock(new mc.BlockLocation(int(pos[0]), int(pos[1]), int(pos[2]))).trySetPermutation(permutation)
                count++
            })
            File.move(`replay/break/${who}.rep`, `replay/Logger/cache/${this.currentOrder}.cache`)
            File.writeLine(`replay/Logger/cache/${this.currentOrder}.cache`, "break")
            this.currentOrder++
            File.writeTo("replay/Logger/currentOrder.config", this.currentOrder.toString())
            log(`§2回放成功${count}条记录`)
            log("§2cache创建成功,新的cache位于" + `§ereplay/Logger/cache/${this.currentOrder - 1}.cache`)
        }
    },
    replayClose() {
        File.writeTo("replay/isOpen.config", "0")
        this.isOpen = false
        log("OK")
    },
    replayOpen() {
        File.writeTo("replay/isOpen.config", "1")
        this.isOpen = true
        log("OK")
    },
    LoggerOpen() {
        File.writeTo("replay/Logger/isOpen.config", "1")
        this.isLogged = true
        log("OK")
    },
    LoggerClose() {
        File.writeTo("replay/Logger/isOpen.config", "0")
        this.isLogged = false
        log("OK")
    },
    /**
     * 
     * @param {number} order 
     */
    cancel(order) {
        if (!File.exsits(`replay/Logger/cache/${order}.cache`)) {
            log("§4未找到该记录(已被清理或输错序号?)")
            return
        }
        const all = File.readFrom(`replay/Logger/cache/${order}.cache`).split('\n')
        const type = all.pop()
        all.forEach((each) => {
            if (each == "") return
            const pos = each.split(' ')
            if (type == "place") {
                var permutation = mc.MinecraftBlockTypes[pos[3].substring(10)].createDefaultBlockPermutation()
                pos[4].split(';').forEach((each) => { permutation.getProperty(each.split('->')[0]).value = each.split('->')[1] })
                overworld.getBlock(new mc.BlockLocation(int(pos[0]), int(pos[1]), int(pos[2]))).trySetPermutation(permutation)
            }
            else overworld.getBlock(new mc.BlockLocation(int(pos[0]), int(pos[1]), int(pos[2]))).setPermutation(mc.MinecraftBlockTypes.air.createDefaultBlockPermutation())
        })
        File.delete(`replay/Logger/cache/${order}.cache`)
        log(`§2撤回成功`)
    },
    help() {
        ["====================================================================================",
            "Fe回放系统V0.0.1 --- Base : Fe文件系统V0.0.1",
            "请注意 : 在V1.0.0一下的版本均为测试版,请勿用于正式生产环境,如需使用,请做好地图备份",
            "===================================================================================="
        ].forEach((tip) => {
            var color_format = "§2"
            if (tip == "====================================================================================") color_format = "§1§l"
            else if (tip == "Fe回放系统V0.0.1 --- Base : Fe文件系统V0.0.1") color_format = "§e§l"
            else if (tip == "请注意 : 在V1.0.0一下的版本均为测试版,请勿用于正式生产环境,如需使用,请做好地图备份") color_format = "§4§l"
            log(color_format + tip)
        })
    },
    clearcache() { File.delete(`replay/Logger/cache/`); File.writeTo("replay/Logger/currentOrder.config", '0'); this.currentOrder = 0; log("§2清除成功") },
    isOpen: int(File.readFrom("replay/isOpen.config")) != 0,
    isLogged: int(File.readFrom("replay/isLogged.config")) != 0,
    currentOrder: (!File.exsits("replay/Logger/currentOrder.config")) ? 0 : int(File.readFrom("replay/Logger/currentOrder.config"))
}

export { replay }