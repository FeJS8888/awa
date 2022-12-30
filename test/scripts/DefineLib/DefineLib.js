import * as mc from "@minecraft/server"
const world = mc.world
const overworld = world.getDimension('overworld')
/**
 * 
 * @param {string} cmd 
 * @returns 
 */
function runCommand(cmd) {
    return overworld.runCommandAsync(cmd)
}
/**
 * 
 * @param {string} str 
 */
function log(str) {
    Array.from(world.getPlayers()).forEach((each) => { each.tell(str) })
}
const dx = [1, -1, 0, 0, 0, 0]
const dy = [0, 0, 1, -1, 0, 0]
const dz = [0, 0, 0, 0, 1, -1]
const Can_not_break_blocks = [
    "wool",
    "stone",
    "cobblestone",
    "stone_block_slab",
    "stone_block_slab2",
    "stone_block_slab3",
    "stone_block_slab4",
    "stone_brick",
    "messy_stone_brick",
    "messy_cobblestone",
    "grass",
    "dirt",
    "glass_pane",
    "concrete",
    "fence",
    "wood",
    "leaves",
    "leaves2",
    "planks_slab",
    "spruce_stairs",
    "yellow_flower",
    "red_flower",
    "diamond_block",
    "cobblesstone_wall",
    "stone_block_slab2",
    "polished_diorite_stairs",
    "sea_lantern",
    "red_sandstone",
    "dried_kelp_block",
    "tallgrass",
    "bamboo",
    "mud_bricks",
    "brick_block",
    "stone_brick_stairs",
    "emerald_block",
    "stonebrick",
    "glowstone",
    "stained_glass_pane",
    "double_stone_block_slab",
    "tuff"
]
const Can_not_explode_blocks = {
    "stone": 0,
    "cobblestone": 0,
    "stone_block_slab": 0,
    "stone_block_slab2": 0,
    "stone_block_slab3": 0,
    "stone_block_slab4": 0,
    "stone_brick": 0,
    "messy_stone_brick": 0,
    "messy_cobblestone": 0,
    "grass": 0,
    "dirt": 0,
    "glass_pane": 0,
    "concrete": 0,
    "fence": 0,
    "wood": 0,
    "leaves": 0,
    "leaves2": 0,
    "planks_slab": 0,
    "spruce_stairs": 0,
    "yellow_flower": 0,
    "red_flower": 0,
    "diamond_block": 0,
    "cobblesstone_wall": 0,
    "stone_block_slab2": 0,
    "polished_diorite_stairs": 0,
    "sea_lantern": 0,
    "red_sandstone": 0,
    "dried_kelp_block": 0,
    "tallgrass": 0,
    "bamboo": 0,
    "mud_bricks": 0,
    "brick_block": 0,
    "stone_brick_stairs": 0,
    "emerald_block": 0,
    "stonebrick": 0,
    "glowstone": 0,
    "stained_glass_pane": 0,
    "bed": 0,
    "bedrock": 0,
    "barrier": 0,
    "double_stone_block_slab": 0,
    "tuff": 0,
    "glass": 0
}
const int = parseInt
function getScore(Obj, Name) {
    return world.scoreboard.getObjective(Obj) == undefined ? undefined : world.scoreboard.getObjective(Obj).getParticipants().find((find) => { return find.displayName == Name }) == undefined ? undefined : world.scoreboard.getObjective(Obj).getScore(world.scoreboard.getObjective(Obj).getParticipants().find((find) => { return find.displayName == Name }))
}
world.events.itemUseOn.subscribe((on) => { if (on.item.typeId == "minecraft:stick" && on.item.data == 32767) overworld.getBlock(on.blockLocation).setType(mc.MinecraftBlockTypes.air) })

export { dx, dy, dz, Can_not_break_blocks, Can_not_explode_blocks, int, getScore, mc, world, overworld, runCommand, log }
