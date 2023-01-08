import { world } from "@minecraft/server"
import { getScore, log, mc, overworld, runCommand, toLocation } from "../DefineLib/DefineLib"
function commonError() {
    log("§4未找到File根部")
}
var File = {
    version: "V0.0.1",
    Root: Array.from(overworld.getEntities({ "name": "File(root)", "type": "file:dir" }))[0],
    currentPath: world.scoreboard.getObjective("File") != undefined ? world.scoreboard.getObjective("File").getParticipants().find((find) => { return find.displayName.startsWith("currentPath->") }) == undefined ? "File(root)" : world.scoreboard.getObjective("File").getParticipants().find((find) => { return find.displayName.startsWith("currentPath->") }).displayName.substring(13) : undefined,
    /**
     * 
     * @param {string} path 
     * @param {boolean | undefined} isLogged
     */
    touch(path, isLogged) {
        isLogged = isLogged == undefined ? false : isLogged
        if (!this.inited) {
            if (isLogged) commonError()
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
        if (isLogged) log("§2创建文件成功")
        return file
    },
    /**
     * 
     * @param {string} path 
     * @param {string} str 
     * @param {boolean | undefined} isLogged
     */
    writeTo(path, str, isLogged) {
        isLogged = isLogged == undefined ? false : isLogged
        if (!this.inited) {
            if (isLogged) commonError()
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
        if (isLogged) log("§2写入文件成功")
        return path
    },
    /**
    * 
    * @param {string} path 
    * @param {string} str 
     * @param {boolean | undefined} isLogged
    */
    writeLine(path, str, isLogged) {
        isLogged = isLogged == undefined ? false : isLogged
        if (!this.inited) {
            if (isLogged) commonError()
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
        if (isLogged) log("§2写入文件成功")
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
            var root = overworld.spawnEntity("file:dir", toLocation(pos))
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
     * @param {boolean | undefined} isLogged
     */
    delete(path, isLogged) {
        isLogged = isLogged == undefined ? false : isLogged
        const file = Array.from(overworld.getEntities({ "name": path, "type": path.endsWith('/') ? "file:dir" : "file:file" }))[0]
        if (!file) {
            if (isLogged) log("§4未找到该文件")
            return null
        }
        if (path.endsWith('/')) file.getTags().forEach((each) => { if (!(each == "protected")) this.delete(each) })
        const name = (path.endsWith('/') && path.split('/').length == 2 || !path.endsWith('/') && path.split('/').length == 1) ? "File(root)" : (path.endsWith('/') && path.split('/').length == 2 || !path.endsWith('/') && path.split('/').length == 1) ? "File(root)" : path.substring(0, path.length - path.split('/')[path.split('/').length - (path.endsWith('/') ? 2 : 1)].length - (path.endsWith('/') ? 1 : 0))
        Array.from(overworld.getEntities({ "name": name, "type": "file:dir" }))[0].removeTag(path)
        file.removeTag("protected")
        file.kill()
        if (isLogged) log("§4删除文件成功")
    },
    /**
     * 
     * @param {string} path 
     * @param {number} times 
     */
    deleteLine(path, times) {
        const before = File.readFrom(path)
        const old = Array.from(overworld.getEntities({ "name": path, "type": "file:file" }))[0]
        if (old == undefined) {
            log("§4未找到该文件")
            return null
        }
        old.removeTag(old.getTags().find((find) => { return find != "protected" }))
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
        args.forEach((file, index) => { total += this.readFrom(file) == undefined ? "" : (this.readFrom(file) + ((index != args.length - 1) ? '\n' : "")) })
        log(args.toString())
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
    },/**
    * 
    * @param {string} path 
    * @param {number} Lines
    * @param {boolean | undefined} isLogged
    */
   readFrom_Lines(path,Lines, isLogged) {
       isLogged = isLogged == undefined ? false : isLogged
       isLogged = true
       if (Array.from(overworld.getEntities({ "type": "file:file", "name": path }))[0] == undefined) {
           if (isLogged) log("§4未找到该文件")
           return null
       }
       var str = Array.from(overworld.getEntities({ "type": "file:file", "name": path }))[0].getTags().find((find) => { return find != "protected" })
       str = str == undefined ? "" : str
       var tot = ""
       var isFirst = true
       for(var i = 0;i < Lines;++ i) {
        if(!isFirst) tot += '\n'
        else isFirst = false
        tot += str.split('\n')[i]
       }
       if (isLogged) log(`§e=========§r §2${path} §e=========§r\n` + tot + `\n§e=========§r §1EOF§r §e=========§r`)
       return str
   },
    /**
     * 
     * @param {string} path 
     */
    cd(path) {
        if (path != "File(root)") {
            if (!path.endsWith('/')) path += '/'
            if (path.startsWith('./')) {
                path = (this.currentPath != "File(root)" ? this.currentPath : "") + path.substring(2)
            }
            else if (path.startsWith('../')) {
                if (this.currentPath == "File(root)") {
                    log("§4无法返回上级目录")
                    return undefined
                }
                path = this.currentPath.substring(0, this.currentPath.length - (this.currentPath.split('/')[this.currentPath.split('/').length - 2].length + 1))
                if (!path.endsWith('/')) path += '/'
                if (path == '/') path = "File(root)"
            }
            if (!this.exsits(path) && path != "File(root)") {
                log("§4目录不存在")
                return undefined
            }
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
        if (path == "File(root)") log("§eFile(root)")
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
     * @param {string} opinionString
     */
    filter(path,opinionString){
        if(this.readFrom(path) == null){
            return undefined
        }
        var str = ""
        this.readFrom(path).split('\n').forEach((each) =>{if(each != opinionString) str += (((str == "") ? "" : "\n") + each)})
        this.writeTo(path,str)
    },
    /**
     * 
     * @param {string} path 
     */
    exsits(path) {
        return !path.endsWith('/') ? Array.from(overworld.getEntities({ "name": path, "type": "file:file" })).length == 1 : Array.from(overworld.getEntities({ "name": path, "type": "file:dir" })).length == 1
    },
    help() {
        ["====================================================================================",
            "Fe文件系统" + this.version,
            "File.uninit | File.init : 初始化函数,任何操作之前必须执行过初始化,不然会报错",
            "File.writeTo | File.writeLine : 写入文件",
            "File.read : 读取文件内容",
            "File.ls | File.list : 列出当前目录下所有文件",
            "File.cd : 切换目录",
            "File.touch : 新建文件",
            "File.mkdir : 新建文件夹",
            "File.cp : 复制文件",
            "File.mv : 移动文件",
            "File.inited : 是否已初始化",
            "File.currentPath : 当前目录",
            "File.merge : 合并文件",
            "File.delete : 删除文件",
            "File.deleteLine : 删除某个文件末尾一行",
            "===================================================================================="].forEach((tip) => {
                var color_format = "§2"
                if (tip == "====================================================================================") color_format = "§1§l"
                else if (tip == "Fe文件系统" + this.version) color_format = "§e§l"
                log(color_format + tip)
            })
    },
    debug() {
        if (!this.inited) {
            log("§4未初始化")
            return 0
        }
        var nobug = true
        var all = {}
        Array.from(overworld.getEntities({ "type": "file:file" })).forEach((each) => { all[each.nameTag] = ((all[each.nameTag] == undefined) ? 1 : all[each.nameTag] + 1) })
        for (var i in all) if (all[i] != 1) {
            log("§4发现§e" + all[i] + "§4份同一位置的§e" + i + "§4文件,已删除多余文件")
            runCommand(`kill @e[type = file:file,name = "${i}",c = ${all[i] - 1}]`)
            nobug = false
        }
        var all2 = {}
        Array.from(overworld.getEntities({ "type": "file:dir" })).forEach((each) => { all2[each.nameTag] = ((all2[each.nameTag] == undefined) ? 1 : all2[each.nameTag] + 1) })
        for (var i in all2) if (all2[i] != 1) {
            log("§4发现§e" + all2[i] + "§4份同一位置的§e" + i + "§4文件夹,已删除多余文件夹")
            runCommand(`kill @e[type = file:dir,name = "${i}“,c = ${all[i] - 1}]`)
            nobug = false
        }
        if(nobug) log("§2未找到bug,如仍无法使用,请联系FeJS8888 - §eQQ3270208782")
        return 1
    },
    inited: world.scoreboard.getObjective("File") == undefined ? false : getScore("File", "inited") == undefined ? false : true
}
world.events.entityHurt.subscribe((hurt) => {
    if (hurt.hurtEntity.hasTag("protected")) {
        const newfile = overworld.spawnEntity(hurt.hurtEntity.typeId, toLocation(hurt.hurtEntity.location))
        hurt.hurtEntity.getTags().forEach((tag) => { newfile.addTag(tag) })
        newfile.nameTag = hurt.hurtEntity.nameTag
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
        else if (op.startsWith("writeTo ")) File.writeTo((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(8).split("->")[0], op.substring(8).split("->")[1], true)
        else if (op.startsWith("writeLine ")) File.writeLine((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(10).split("->")[0], op.substring(10).split("->")[1], true)
        else if (op.startsWith("mkdir ")) File.mkdir((File.currentPath != "File(root)" ? File.currentPath : "") + (op.substring(6).endsWith('/') ? op.substring(6) : op.substring(6) + '/'))
        else if (op.startsWith("touch ")) File.touch((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(6), true).addTag("")
        else if (op.startsWith("read ")) File.readFrom((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5), true)
        else if (op.startsWith("delete ")) File.delete((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(7), true)
        else if (op.startsWith("copy ")) File.copy((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[0], (File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[1])
        else if (op.startsWith("cp ")) File.copy((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[0], (File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[1])
        else if (op.startsWith("move ")) File.move((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[0], (File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(5).split('->')[1])
        else if (op.startsWith("mv ")) File.move((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[0], (File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(3).split('->')[1])
        else if (op.startsWith("run ")) (File[op.split(' ')[1]] != undefined) ? (typeof File[op.split(' ')[1]] != 'function') ? log(File[op.split(' ')[1]].toString()) : File[op.split(' ')[1]](...op.substring(4 + op.substring(4).split(' ')[0].length + 1).split(' ')) : log("§4执行命令失败(未找到命令)")
        else if (op.startsWith("cd ")) File.cd(op.substring(3))
        else if (op == "help") File.help()
        else if (op == "version") log(File.version)
        else if (op.startsWith("deleteLine ")) File.deleteLine((File.currentPath != "File(root)" ? File.currentPath : "") + op.substring(11), 1)
        else log("错误的参数>>§4" + op.split(' ')[0] + "§r<<")
    }
})
export { File }
