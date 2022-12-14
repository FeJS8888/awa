import { world, overworld, runCommand, log, mc, toLocation } from "./DefineLib/DefineLib"
import { Can_not_break_blocks, Can_explode_blocks } from "./DefineLib/DefineLib"
import { BedWars } from "./BedWarsLib/BedWarsLib"
import { replay } from "./replayLib/replayLib"
import tick from "./server-plus/tick"
import { RunCode } from "./RunLib/RunLib"
world.events.before
world.events.beforeExplosion.subscribe((exp) => {
    if(exp.source == undefined) return
    log(exp.source.location.x.toFixed())
    overworld.createExplosion(toLocation(exp.source.location),10,{"breaksBlocks":false})
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
        if (Can_explode_blocks[overworld.getBlock(exp.impactedBlocks[i]).type.id.substring(10)] != undefined) runCommand(`setblock ${exp.impactedBlocks[i].x} ${exp.impactedBlocks[i].y} ${exp.impactedBlocks[i].z} air 0 destroy`)
    }
    log(exp.impactedBlocks.length.toString())
})

world.events.blockPlace.subscribe(place => {
    if (place.block.type.id == "minecraft:tnt") {
        place.block.setType(mc.MinecraftBlockTypes.air)
        overworld.spawnEntity("minecraft:tnt", place.block.location)
    }
})
world.events.blockBreak.subscribe((br) => { if (Can_not_break_blocks.find((find) => { return "minecraft:" + find == br.brokenBlockPermutation.type.id })) br.block.setPermutation(br.brokenBlockPermutation) })

// world.events.entityHit.subscribe((hit) =>{
//     if(hit.hitBlock.typeId == "minecraft:chest"){
//         runCommand(`clone ${hit.hitBlock.location.x} ${hit.hitBlock.location.y} ${hit.hitBlock.location.z} ${hit.hitBlock.location.x} ${hit.hitBlock.location.y} ${hit.hitBlock.location.z} ${hit.hitBlock.location.x} ${hit.hitBlock.location.y + 100} ${hit.hitBlock.location.z} replace move`).then(() =>{
//             runCommand(`clone ${hit.hitBlock.location.x} ${hit.hitBlock.location.y + 100} ${hit.hitBlock.location.z} ${hit.hitBlock.location.x} ${hit.hitBlock.location.y + 100} ${hit.hitBlock.location.z} ${hit.hitBlock.location.x} ${hit.hitBlock.location.y} ${hit.hitBlock.location.z} replace normal`).then()
//         })
//     }
// })

// tick.subscribe(() =>{
//     Array.from(overwworld.getEntities({"type":"item"})).forEach((item) =>{
//         if(overworld.getBlock(new mc.BlockLocation(item.location.x.toFixed(),item.location.y.toFixed(),item.location.z.toFixed())).typeId == "minecraft:chest"){
//             item.addEffect
//         }
//     })
// })

world.events.itemUse.subscribe((item) => {
    if (item.item.typeId == "minecraft:compass") {
        BedWars.JoinMap(item.source)
    }
})


log("????????????")