/*Obfuscated by JShaman.com*/import*as _0x129508 from'@minecraft/server';const world=_0x129508['world'];const overworld=world['getDimension']('overworld');function runCommand(_0x423271){return overworld['runCommandAsync'](_0x423271);}function log(_0x155293){Array['from'](world['getPlayers']())['forEach'](_0x280439=>{_0x280439['tell'](_0x155293);});}const dx=[0xd46f5^0xd46f4,-(0xaccc0^0xaccc1),0x72103^0x72103,0x2cff7^0x2cff7,0x8dcae^0x8dcae,0x44aee^0x44aee];const dy=[0x886eb^0x886eb,0x714e6^0x714e6,0x44b64^0x44b65,-(0xad328^0xad329),0x0,0xeef06^0xeef06];const dz=[0x48f74^0x48f74,0x512f6^0x512f6,0x44df2^0x44df2,0x6cf32^0x6cf32,0x69a48^0x69a49,-0x1];const Can_not_break_blocks=['wool','stone','cobblestone','stone_block_slab','stone_block_slab2','stone_block_slab3','stone_block_slab4','stone_brick','messy_stone_brick','messy_cobblestone','grass','dirt','glass_pane','concrete','fence','wood','leaves','leaves2','planks_slab','spruce_stairs','yellow_flower','red_flower','diamond_block','cobblesstone_wall','stone_block_slab2','polished_diorite_stairs','sea_lantern','red_sandstone','dried_kelp_block','tallgrass','bamboo','mud_bricks','brick_block','stone_brick_stairs','emerald_block','stonebrick','glowstone','stained_glass_pane','double_stone_block_slab','tuff'];const Can_not_explode_blocks={'stone':0x0,'cobblestone':0x0,'stone_block_slab':0x0,'stone_block_slab2':0x0,'stone_block_slab3':0x0,'stone_block_slab4':0x0,'stone_brick':0x0,'messy_stone_brick':0x0,'messy_cobblestone':0x0,'grass':0x0,'dirt':0x0,'glass_pane':0x0,'concrete':0x0,'fence':0x0,'wood':0x0,'leaves':0x0,'leaves2':0x0,'planks_slab':0x0,'spruce_stairs':0x0,'yellow_flower':0x0,'red_flower':0x0,'diamond_block':0x0,'cobblesstone_wall':0x0,'stone_block_slab2':0x0,'polished_diorite_stairs':0x0,'sea_lantern':0x0,'red_sandstone':0x0,'dried_kelp_block':0x0,'tallgrass':0x0,'bamboo':0x0,'mud_bricks':0x0,'brick_block':0x0,'stone_brick_stairs':0x0,'emerald_block':0x0,'stonebrick':0x0,'glowstone':0x0,'stained_glass_pane':0x0,'bed':0x0,'bedrock':0x0,'barrier':0x0,'double_stone_block_slab':0x0,'tuff':0x0,'glass':0x0};const int=parseInt;function getScore(_0x5f5b27,_0x160ce6){return world['scoreboard']['getObjective'](_0x5f5b27)['getParticipants']()['find'](_0x326c83=>{return _0x326c83['displayName']==_0x160ce6;})==undefined?undefined:world['scoreboard']['getObjective'](_0x5f5b27)['getScore'](world['scoreboard']['getObjective'](_0x5f5b27)['getParticipants']()['find'](_0x43f9df=>{return _0x43f9df['displayName']==_0x160ce6;}));}export{dx,dy,dz,Can_not_break_blocks,Can_not_explode_blocks,int,getScore,_0x129508 as mc,world,overworld,runCommand,log};