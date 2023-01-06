import { int, log, mc, overworld, text_redirect, world } from "../DefineLib/DefineLib";
import { File } from "../FileLib/FileLib";

world.events.blockPlace.subscribe((pl) => { if (replay.isOpen/* && Can_not_break_blocks.find((find) => { return "minecraft:" + find == pl.block.typeId }) == undefined*/) { var total = ""; const all = pl.block.permutation.getAllProperties(); all.forEach((each, index) => { total += (each.name + "->" + each.value + ((index < all.length - 1) ? ";" : "")) }); File.writeLine(`replay/place/${pl.player.name}.rep`, `${pl.block.location.x} ${pl.block.location.y} ${pl.block.location.z} ${pl.block.type.id} ${total}`) } })
world.events.blockBreak.subscribe((pl) => { if (replay.isOpen/* && Can_not_break_blocks.find((find) => { return "minecraft:" + find == pl.brokenBlockPermutation.type.id }) == undefined*/) { var total = ""; const all = pl.brokenBlockPermutation.getAllProperties(); all.forEach((each, index) => { total += (each.name + "->" + each.value + ((index < all.length - 1) ? ";" : "")) }); File.writeLine(`replay/break/${pl.player.name}.rep`, `${pl.block.location.x} ${pl.block.location.y} ${pl.block.location.z} ${pl.brokenBlockPermutation.type.id} ${total}`) } })
var replay = {
    version: "V0.0.1",
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
                var permutation = mc.MinecraftBlockTypes[((text_redirect[pos[3].substring(10)] == undefined) ? pos[3].substring(10) : text_redirect[pos[3].substring(10)])].createDefaultBlockPermutation()
                if (pos[4].split(';').length != 1) pos[4].split(';').forEach((each) => { log(each.split('->')[0] + " : " + each.split('->')[1]); permutation.getProperty(each.split('->')[0]).value = (each.split('->')[1] == "false" ? false : (each.split('->')[1] == "true" ? true : (int(each.split('->')[1]) != NaN ? int(each.split('->')[1]) : each.split('->')[1]))) })
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
                if (pos[4].split(';').length != 1) pos[4].split(';').forEach((each) => { permutation.getProperty(each.split('->')[0]).value = each.split('->')[1] })
                overworld.getBlock(new mc.BlockLocation(int(pos[0]), int(pos[1]), int(pos[2]))).trySetPermutation(permutation)
            }
            else overworld.getBlock(new mc.BlockLocation(int(pos[0]), int(pos[1]), int(pos[2]))).setPermutation(mc.MinecraftBlockTypes.air.createDefaultBlockPermutation())
        })
        File.delete(`replay/Logger/cache/${order}.cache`)
        log(`§2撤回成功`)
    },
    help() {
        ["====================================================================================",
            `Fe回放系统${this.version} --- Base : Fe文件系统${File.version}`,
            "请注意 : 在V1.0.0一下的版本均为测试版,请勿用于正式生产环境,如需使用,请做好地图备份",
            "基础功能 :",
            "replay.open : 开启回放记录",
            "replay.close : 关闭回放记录",
            "replay.place 玩家名 : 撤回该玩家的放置方块行为",
            "replay.break 玩家名 : 撤回该玩家的破坏方块行为",
            "replay.cancel cache序号 : 撤回该序号的回放记录",
            "进阶功能 :",
            "replay.run : 执行replay库中任意方法/属性",
            "例如 :",
            "replay.run isOpen : 查询回放系统是否开启",
            "replay.run clearcache : 清除已删除的记录(将会导致无法撤销回放操作)",
            "replay.run currentOrder : 查询下一个cache的序号",
            "replay.run LoggerOpen : 开启cache记录",
            "replay.run LoggerClose : 关闭cache记录",
            "replay.run isLogged : 查询是否开启cache记录",
            "===================================================================================="
        ].forEach((tip) => {
            var color_format = "§2"
            if (tip == "====================================================================================") color_format = "§1§l"
            else if (tip == `Fe回放系统${this.version} --- Base : Fe文件系统${File.version}`) color_format = "§e§l"
            else if (tip == "请注意 : 在V1.0.0一下的版本均为测试版,请勿用于正式生产环境,如需使用,请做好地图备份") color_format = "§4§l"
            log(color_format + tip)
        })
    },
    clearcache() { File.delete(`replay/Logger/cache/`); File.writeTo("replay/Logger/currentOrder.config", '0'); this.currentOrder = 0; log("§2清除成功") },
    isOpen: int(File.readFrom("replay/isOpen.config")) != 0,
    isLogged: int(File.readFrom("replay/isLogged.config")) != 0,
    currentOrder: (!File.exsits("replay/Logger/currentOrder.config")) ? 0 : int(File.readFrom("replay/Logger/currentOrder.config"))
}

world.events.beforeChat.subscribe((chat) => {
    if (chat.message.startsWith("replay.")) {
        chat.cancel = true
        const op = chat.message.substring(7)
        if (op.startsWith("break ")) replay.replayBreak(op.substring(6))
        else if (op.startsWith("place ")) replay.replayPlace(op.substring(6))
        else if (op.startsWith("cancel ")) replay.cancel(int(op.substring(7)))
        else if (op.startsWith("run ")) replay[op.split(' ')[1]] != undefined ? (typeof replay[op.split(' ')[1]] != 'function') ? log(replay[op.split(' ')[1]].toString()) : replay[op.split(' ')[1]](...op.substring(4 + op.substring(4).split(' ')[0].length + 1).split(' ')) : log("§4执行命令失败(未找到命令)")
        else if (op == "open") replay.replayOpen()
        else if (op == "close") replay.replayClose()
        else if (op == "help") replay.help()
        else log("错误的参数>>§4" + op.split(' ')[0] + "§r<<")
    }
})

export { replay }
