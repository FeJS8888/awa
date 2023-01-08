import * as mc from "@minecraft/server"
import tick from "../server-plus/tick"
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
 * @param {mc.Vector3} vector 
 */
function toLocation(vector) {
    return new mc.Location(vector.x, vector.y, vector.z)
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
    "cobblestone_wall",
    "end_bricks",
    "ender_chest",
    "chest",
    "stone",
    "cobblestone",
    "stone_block_slab",
    "stone_block_slab2",
    "double_stone_block_slab2",
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
const Can_explode_blocks = {
    "endstone":0,
    "wool":0,
    "planks":0
}
const color_format = {
    "blue": "§1",
    "green": "§2",
    "yellow": "§e",
    "red": "§4"
}
const color_format2 = {
    "minecraft:diamond": "§3",
    "minecraft:emerald": "§a",
    "minecraft:gold_ingot": "§6",
    "minecraft:iron_ingot": "§f"
}
const text_format = {
    "minecraft:diamond": "钻石",
    "minecraft:emerald": "绿宝石",
    "minecraft:gold_ingot": "金锭",
    "minecraft:iron_ingot": "铁锭"
}
const text_redirect = {
    "command_block": "commandBlock",
    "wooden_button": "woodenButton"
}
const bed_order_to_color = {
    "1":"§4红",
    "2":"§2绿",
    "3":"§1蓝",
    "0":"§e黄"
}
const int = parseInt
function getScore(Obj, Name) {
    return world.scoreboard.getObjective(Obj) == undefined ? undefined : world.scoreboard.getObjective(Obj).getParticipants().find((find) => { return find.displayName == Name }) == undefined ? undefined : world.scoreboard.getObjective(Obj).getScore(world.scoreboard.getObjective(Obj).getParticipants().find((find) => { return find.displayName == Name }))
}
const bed_location = { "3": "977 24 1023", "0": "1023 24 977", "1": "1069 24 1023", "2": "1023 24 1069" }
const bed_location_reserve = { "977 24 1023": "3", "1023 24 977": "0", "1069 24 1023": "1", "1023 24 1069": "2" }
const bed_location_reserve2 = { "976 24 1023": "3", "1023 24 976": "0", "1070 24 1023": "1", "1023 24 1070": "2" }
const bear_location = { "3": ["967 24 1023", 270], "0": ["1023 24 967", 0], "1": ["1079 24 1023", 90], "2": ["1023 24 1079", 180] }


world.events.itemUseOn.subscribe((on) => { if (on.item.typeId == "minecraft:stick" && on.item.data == 32767) overworld.getBlock(on.blockLocation).setType(mc.MinecraftBlockTypes.air) })


export {
    dx, dy, dz,
    Can_not_break_blocks, Can_explode_blocks,
    int, getScore,
    mc, world, overworld, runCommand, log,
    toLocation,
    color_format, color_format2,bed_order_to_color,
    text_format, text_redirect,
    bed_location, bear_location, bed_location_reserve, bed_location_reserve2
}
