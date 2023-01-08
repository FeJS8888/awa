import { File } from "../FileLib/FileLib"
import { mc, world, overworld, runCommand, log,} from "../DefineLib/DefineLib"
var RunCode = {
    /**
     * 
     * @param {string} file 
     */
    async JS(file){
        if(!File.exsits(file)){
            log("§4未找到代码")
            return
        }
        Function(`let mc;await import("@minecraft/server").then((m) =>{mc = m;` + File.readFrom(file) + "});")()
    }
}

world.events.beforeChat.subscribe((chat) => {
    if (chat.message.startsWith("RunCode.")) {
        chat.cancel = true
        const op = chat.message.substring(8)
        log(op)
        if (op.startsWith('JS')) RunCode.JS(op.substring(3))
        else log("错误的参数>>§4" + op.split(' ')[0] + "§r<<")
    }
})

export {RunCode}