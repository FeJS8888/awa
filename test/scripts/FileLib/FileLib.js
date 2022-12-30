import { world } from "@minecraft/server"
import { getScore, log, mc, overworld, runCommand } from "../DefineLib/DefineLib"
function commonError() {
    log("§4未找到File根部")
}
var File = {
    Root: Array.from(overworld.getEntities({ "name": "File(root)", "type": "file:dir" }))[0],
    currentPath: world.scoreboard.getObjective("File") != undefined ? world.scoreboard.getObjective("File").getParticipants().find((find) => { return find.displayName.startsWith("currentPath->") }) == undefined ? "File(root)" : world.scoreboard.getObjective("File").getParticipants().find((find) => { return find.displayName.startsWith("currentPath->") }).displayName.substring(13) : undefined,
    /**
     * 
     * @param {string} path 
     */
    touch(path) {
        if (!this.inited) {
            commonError()
            return undefined
        }
        const x = getScore("File", "x")
        const y = getScore("File", "y")
        const z = getScore("File", "z")
        var file = overworld.spawnEntity("file:file", new mc.Location(x, y, z))
        file.nameTag = path
        file.addTag("protected")
        var str = ""
        var last = "File(root)"
        // this.Root.addTag(path.split('/')[0] + path.split('/').length == 1 ? "" : "/")
        const each = path.split('/')
        for (var i = 0; i < each.length - 1; ++i) {
            str += each[i] + '/'
            const all = Array.from(overworld.getEntities({ "name": str, "type": "file:dir" }))[0]
            if (all == undefined) {
                const newfile = overworld.spawnEntity("file:dir", new mc.Location(x, y, z))
                newfile.addTag("protected")
                newfile.nameTag = str
            }
            Array.from(overworld.getEntities({ "name": last, "type": "file:dir" }))[0].addTag(str)
            last = str
        }
        Array.from(overworld.getEntities({ "name": last, "type": "file:dir" }))[0].addTag(path)
        log("§2创建文件成功")
        return file
    },
    /**
     * 
     * @param {string} path 
     * @param {string} str 
     */
    writeTo(path, str) {
        if (!this.inited) {
            commonError()
            return undefined
        }
        var op = {}
        op.name = path
        op.type = "file:file"
        const file = Array.from(overworld.getEntities(op))[0]
        if (file == undefined) this.touch(path).addTag(str)
        else {
            file.getTags().forEach((tag) => { file.removeTag(tag) })
            file.addTag("protected")
            file.addTag(str)
        }
        log("§2写入文件成功")
        return path
    },
    /**
    * 
    * @param {string} path 
    * @param {string} str 
    */
    writeLine(path, str) {
        if (!this.inited) {
            commonError()
            return undefined
        }
        var op = {}
        op.name = path
        op.type = "file:file"
        const file = Array.from(overworld.getEntities(op))[0]
        if (file == undefined) this.touch(path).addTag(str)
        else {
            var tag = File.readFrom(path)
            file.removeTag(tag)
            tag += ((tag == "" ? "" : "\n") + str)
            file.addTag(tag)
        }
        log("§2写入文件成功")
        return path
    },
    /**
     * 
     * @param {mc.Vector3} pos 
     */
    uninit(pos) {
        runCommand(`tp @e[type=file:file] ${pos.x} ${pos.y} ${pos.z}`)
        runCommand(`tp @e[type=file:dir] ${pos.x} ${pos.y} ${pos.z}`)
        if (world.scoreboard.getObjective("File") && getScore("File", "inited")) runCommand(`scoreboard players reset "inited" File`)
        runCommand(`tickingarea remove File`)
        this.inited = false
        log("OK")
    },
    /**
     * 
     * @param {mc.Vector3} pos 
     */
    init(pos) {
        if (!world.scoreboard.getObjective("File")) world.scoreboard.addObjective("File", "File")
        var op = {}
        op.type = "file:dir"
        op.name = "File(root)"
        runCommand(`scoreboard players set "currentPath->File(root)" File 1`)
        this.currentPath = "File(root)"
        runCommand(`scoreboard players set "inited" File 1`)
        runCommand(`tickingarea add ${pos.x.toFixed()} ${pos.y.toFixed()} ${pos.z.toFixed()} ${pos.x.toFixed()} ${pos.y.toFixed()} ${pos.z.toFixed()} File true`)
        if (Array.from(overworld.getEntities(op)).length == 0) {
            var root = overworld.spawnEntity("file:dir", pos)
            root.nameTag = "File(root)"
            root.addTag("protected")
        }
        runCommand(`scoreboard players set "x" File ${pos.x.toFixed()}`)
        runCommand(`scoreboard players set "y" File ${pos.y.toFixed()}`)
        runCommand(`scoreboard players set "z" File ${pos.z.toFixed()}`)
        this.inited = true
        this.Root = Array.from(overworld.getEntities({ "name": "File(root)", "type": "file:dir" }))[0]
        log("OK")
    },
    /**
     * 
     * @param {string} path 
     */
    delete(path) {
        log(path)
        const file = Array.from(overworld.getEntities({ "name": path, "type": path.endsWith('/') ? "file:dir" : "file:file" }))[0]
        if (!file) {
            log("§4未找到该文件")
            return null
        }
        if (path.endsWith('/')) file.getTags().forEach((each) => { if (!(each == "protected")) this.delete(each) })
        Array.from(overworld.getEntities({ "name": path.endsWith('/') && path.split('/').length == 2 || !path.endsWith('/') && path.split('/').length == 1 ? "File(root)" : path.substring(0, path.length - path.split('/').pop().length), "type": "file:dir" }))[0].removeTag(path)
        file.removeTag("protected")
        file.kill()
        log("§4删除文件成功")
    },
    /**
     * 
     * @param {string} path 
     * @param {number} times 
     */
    deleteLine(path, times) {
        const before = File.readFrom(path)
        const old = Array.from(overworld.getEntities({ "name": path, "type": "file:file" }))[0]
        if(old == undefined){
            log("§4未找到该文件")
            return null
        }
        old.removeTag(old.getTags().find((find) =>{return find != "protected"}))
        var str = ""        
        for (var i = 0; i < before.split('\n').length - times; ++i) str += before.split('\n')[i]
        old.addTag(str)
        log("§2写入文件成功")
    },
    /**
     * 
     * @param {string} from 
     * @param {string} to 
     */
    copy(from, to) {
        if (!this.exsits(from)) log("§4未找到该文件")
        else this.writeTo(to, this.readFrom(from))
    },
    /**
     * 
     * @param {string} from
     * @param {string} to 
     */
    move(from, to) {
        log(from)
        log(to)
        if (!this.exsits(from)) log("§4未找到该文件")
        else {
            this.copy(from, to)
            this.delete(from)
        }
    },
    /**
     * 
     * @param  {...string} args 
     */
    merge(toPath, ...args) {
        var total = ""
        args.forEach((file) => { total += this.readFrom(file) == undefined ? "" : (this.readFrom(file) + '\n') })
        log(args)
        this.writeTo(toPath, total)
    },
    zip() {
        str = "$~ZIP~$\n"

    },
    unzip() {

    },
    mkdir(path) {
        if (!this.inited) {
            commonError()
            return undefined
        }
        const x = getScore("File", "x")
        const y = getScore("File", "y")
        const z = getScore("File", "z")
        var file = overworld.spawnEntity("file:dir", new mc.Location(x, y, z))
        file.nameTag = path
        file.addTag("protected")
        var str = ""
        var last = "File(root)"
        const each = path.split('/')
        for (var i = 0; i < each.length - 2; ++i) {
            str += each[i] + '/'
            const all = Array.from(overworld.getEntities({ "name": str, "type": "file:dir" }))[0]
            if (all == undefined) {
                const newfile = overworld.spawnEntity("file:dir", new mc.Location(x, y, z))
                newfile.addTag("protected")
                newfile.nameTag = str
            }
            Array.from(overworld.getEntities({ "name": last, "type": "file:dir" }))[0].addTag(str)
            last = str
        }
        Array.from(overworld.getEntities({ "name": last, "type": "file:dir" }))[0].addTag(path)
        log("§2创建文件夹成功")
        return file
    },
    /**
     * 
     * @param {string} path 
     * @param {boolean | undefined} isLogged
     */
    readFrom(path, isLogged) {
        isLogged = isLogged == undefined ? false : isLogged
        if (Array.from(overworld.getEntities({ "type": "file:file", "name": path }))[0] == undefined) {
            if (isLogged) log("§4未找到该文件")
            return null
        }
        var str = Array.from(overworld.getEntities({ "type": "file:file", "name": path }))[0].getTags().find((find) => { return find != "protected" })
        str = str == undefined ? "" : str
        if (isLogged) log(`§e=========§r §2${path} §e=========§r\n` + str + `\n§e=========§r §1EOF§r §e=========§r`)
        return str
    },
    /**
     * 
     * @param {string} path 
     */
    cd(path){
        if(!path.endsWith('/')){
            log("§4非文件夹")
            return undefined
        }
        if(path.startsWith('./')) path = this.currentPath + path.substring(2)
        else if(path.startsWith('../')){
            if(this.currentPath == "File(root)"){
                log("§4无法返回上级目录")
                return null
            }
            path = this.currentPath.substring(0, this.currentPath.length - (this.currentPath.split('/')[this.currentPath.split('/').length - 2].length + 1))
        }
        if(!this.exsits(path)){
            log("§4目录不存在")
            return undefined
        }
        runCommand(`scoreboard players reset "currentPath->${this.currentPath}" File`)
        runCommand(`scoreboard players set "currentPath->${path}" File 1`)
        this.currentPath = path
        log("§2成功切换到" + path)
        return path
    },
    /**
     * 
     * @param {string} path 
     * @param {number} tab 
     */
    list(path, tab) { 
        if(path == "File(root)") log("§eFile(root)")
        else if (tab == 1) log("§e" + path.split('/')[path.split('/').length - 2])
        else log("| ".repeat(tab - 1) + "§2" + path.split('/')[path.split('/').length - 2])
        Array.from(overworld.getEntities({ "type": "file:dir", "name": path }))[0].getTags().sort().forEach((each) => {
            if (each == "protected") return
            if (each.endsWith('/')) this.list(each, tab + 1)
            else log("| ".repeat(tab) + each.split('/').pop())
        })
    },
    /**
     * 
     * @param {string} path 
     */
    exsits(path) {
        return !path.endsWith('/') ? Array.from(overworld.getEntities({ "name": path, "type": "file:file" })).length == 1 : Array.from(overworld.getEntities({ "name": path, "type": "file:dir" })).length == 1
    },
    inited: world.scoreboard.getObjective("File") == undefined ? false : getScore("File", "inited") == undefined ? false : true
}
world.events.entityHurt.subscribe((hurt) => {
    if (hurt.hurtEntity.hasTag("protected")) {
        const newfile = overworld.spawnEntity(hurt.hurtEntity.typeId, hurt.hurtEntity.location)
        hurt.hurtEntity.getTags().forEach((tag) => { newfile.addTag(tag) })
        newfile.nameTag = hurt.hurtEntity.nameTag
    }
})
export { File }