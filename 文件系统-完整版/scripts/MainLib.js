// import { replayPlace, replayBreak, replayOpen, replayClose } from "./replayLib/replayLib"
import { world, overworld, runCommand, log, mc } from "./DefineLib/DefineLib"
import { BlockLocation, BlockType, MinecraftBlockTypes } from "@minecraft/server"
import { Can_not_break_blocks, Can_not_explode_blocks, int, getScore } from "./DefineLib/DefineLib"
import { File } from "./FileLib/FileLib"
// import { BedWars } from "./BedWarsLib/BedWarsLib"
world.events.beforeExplosion.subscribe((exp) => {
    exp.cancel = true
    // var queue = []
    // var dis = []
    // var signs = {}
    // queue.push(new BlockLocation(exp.source.headLocation.x,exp.source.headLocation.y,exp.source.headLocation.z))
    log(exp.impactedBlocks.length.toString())
    for (var i = 0; i < exp.impactedBlocks.length; ++i) {
        // log(overworld.getBlock(exp.impactedBlocks[i]).type.id)
        // if(Can_not_explode_blocks[overworld.getBlock(exp.impactedBlocks[i]).type.id.substring(10)] != undefined){
        //     exp.impactedBlocks.splice(i,1)
        //     log("KILL")
        //     continue
        // }
        // const all = exp.impactedBlocks[i].blocksBetween(new mc.BlockLocation(exp.impactedBlocks[i].x, exp.impactedBlocks[i].y, exp.impactedBlocks[i].z))
        // all.unshift(exp.impactedBlocks[i])
        // if (all.find((find) => {
        //     // log(overworld.getBlock(find).type.id)
        //     return Can_not_explode_blocks[overworld.getBlock(find).type.id.substring(10)] != undefined
        // }) != undefined) exp.impactedBlocks.splice(i,1)
        if (Can_not_explode_blocks[overworld.getBlock(exp.impactedBlocks[i]).type.id.substring(10)] == undefined) runCommand(`setblock ${exp.impactedBlocks[i].x} ${exp.impactedBlocks[i].y} ${exp.impactedBlocks[i].z} air 0 destroy`)
    }
    log(exp.impactedBlocks.length.toString())
})

// world.events.blockPlace.subscribe(place => {
//     if (place.block.type.id == "minecraft:tnt") {
//         place.block.setType(mc.MinecraftBlockTypes.air)
//         overworld.spawnEntity("minecraft:tnt", place.block.location)
//     }
// })
// world.events.blockBreak.subscribe((br) => {
//     if (Can_not_break_blocks.find((find) => { return "minecraft:" + find == br.brokenBlockPermutation.type.id })) {
//         br.block.setPermutation(br.brokenBlockPermutation)
//     }
// })

world.events.itemUse.subscribe((item) => {
    if (item.item.typeId == "minecraft:compass") {
        BedWars.JoinMap(item.source)
    }
})

world.events.beforeChat.subscribe((chat) => {
    if (chat.message.startsWith("File.")) {
        chat.cancel = true
        const op = chat.message.substring(5)
        if (op == "uninit") File.uninit(chat.sender.location)
        else if (op == "init") File.init(chat.sender.location)
        else if (op == "inited") log(File.inited.toString())
        else if (op.startsWith("exsits ")) log(File.exsits(op.substring(7)).toString())
        else if (op == "ls" || op == "list") File.list(File.currentPath, 1)
        else if (op.startsWith("writeTo ")) File.writeTo((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(8).split("->")[0], op.substring(8).split("->")[1])
        else if (op.startsWith("writeLine ")) File.writeLine((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(10).split("->")[0], op.substring(10).split("->")[1])
        else if (op.startsWith("mkdir ")) File.mkdir((File.currentPath != "File(root)" ? File.currentPath : "") + (op.substring(6).endsWith('/') ? op.substring(6) : op.substring(6) + '/'))
        else if (op.startsWith("touch ")) File.touch((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(6)).addTag("")
        else if (op.startsWith("read ")) File.readFrom((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5), true)
        else if (op.startsWith("delete ")) File.delete((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(7),true)
        else if (op.startsWith("copy ")) File.copy((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[0],(File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[1])
        else if (op.startsWith("cp ")) File.copy((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[0],(File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[1])
        else if (op.startsWith("move ")) File.move((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[0],(File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[1])
        else if (op.startsWith("mv ")) File.move((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[0],(File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[1])
        else if (op.startsWith("cd ")) File.cd(op.substring(3))
        else if (op.startsWith("deleteLine ")) File.deleteLine((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(11), 1)
        else log("错误的参数>>§4" + op.split(' ')[0] + "§r<<")
    }
    // if (chat.message.startsWith("replay ")) {
    //     chat.cancel = true
    //     const op = chat.message.substring(7)
    //     if (op.startsWith("break ")) replayBreak(op.substring(6))
    //     else if (op.startsWith("place ")) replayPlace(op.substring(6))
    //     else if (op == "open") replayOpen()
    //     else if (op == "close") replayClose()
    //     else log("错误的参数>>§4" + op.split(' ')[0] + "§r<<")
    // }
    // if (chat.message.startsWith("bedwars.")) {
    //     chat.cancel = true
    //     const op = chat.message.substring(8)
    //     if (op == "init") BedWars.init(chat.sender.location)
    //     else if (op == "Preload") BedWars.Preload()
    //     else if (op.startsWith("addPreloadCmd->")) BedWars.addPreloadCmd(op.substring(15))
    //     else log("错误的参数>>§4" + op.split(' ')[0] + "§r<<")
    // }
})
log("重载成功")
// if (!world.scoreboard.getObjective("BedWars")) world.scoreboard.addObjective("BedWars", "BedWars")