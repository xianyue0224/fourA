#!/usr/bin/env node

const chalk = require("chalk")
const prompts = require('prompts')
const { initAnswer, checkInput, generlateHint } = require("./utils")

// banner
const boxen = require('boxen')
console.log(boxen(`玩一下 ${chalk.green.italic.bold("4A0B")} 吧~~需求是没有尽头的，和摸鱼一样……`, { padding: 1, borderColor: "cyan" }))

// 游戏状态
const state = {
    mode: "",
    answer: "",
    hints: [],
    get chance() {
        const m = this.mode
        const l = this.hints.length
        if (m === "simple" || m === "difficulty") {
            return 8 - l
        } else if (m === "general") {
            return 10 - l
        }
    },
    time: undefined,
    get isFinish() {
        if (this.answer && this.hints.length === 0) return false
        return this.hints.at(-1).hint === "4A0B" || this.chance === 0
    }
}


async function main() {

    // 选择游戏难度
    state.mode = (await prompts({
        type: "select",
        name: "mode",
        message: "选择游戏难度：",
        choices: [
            { title: "简单", description: "四个数字不重复，八次机会", value: "simple" },
            { title: "普通", description: "四个数字不重复，十次机会，第五次猜测后其中一个数字会变化", value: "general" },
            { title: "困难", description: "未开发完成……选择此项会结束游戏", value: "difficulty" }
        ]
    }
    )).mode

    if (state.mode === "difficulty") {
        console.log("困难模式打算做成隐藏前面猜测的提示，玩家只能看到最近一次的提示，需要玩家记忆前面的推理结果，但是我太菜了，不知道怎么隐藏前面输出的提示，如果你有办法解决这个问题，欢迎贡献代码。")
        process.exit()
    }

    // 初始化游戏
    initGame()

    // 输出答案
    // console.log(state.answer)

    // 只要游戏未结束，就一直提示用户输入下一步猜测
    while (!state.isFinish) {
        const { value } = await prompts({
            type: "text",
            name: "value",
            message: () => `第${state.hints.length + 1}次猜测`,
            validate: value => {
                if (value === "c" || value === "C") {
                    require("process").exit()
                }

                return checkInput(value) ? true : "你必须输入4个数字，且不能重复"
            }
        })

        handleInput(value)
    }
}

//  初始化游戏
function initGame() {
    state.hints.length = 0
    state.answer = initAnswer()
    state.time = Date.now()
}

// 格式化游戏结束后输出的游戏结果
function formatHints(hints) {
    return hints.map((i, idx) => {
        return {
            "备注": `第${idx + 1}次`,
            "猜测": i.value,
            "提示": i.hint,
            "用时": `${i.time / 1000}秒`
        }
    })
}

// 打印提示
function printHint(value, hint) {
    const mode = state.mode

    // 简单和普通模式正常输出提示
    if (["simple", "general"].includes(mode)) {
        console.log(chalk.yellow.bold.italic(value), " => ", chalk.green.bold.italic(hint))
    }

    // 困难模式隐藏前面的输出
    // TODO
}

// 处理玩家输入的数字
function handleInput(value) {
    // 生成提示
    const hint = generlateHint(value, state.answer)
    // 将输入的数字、提示、时间 存储为游戏状态
    state.hints.push({
        value,
        hint,
        // description: `第${state.current}次猜测：${value} -> ${hint}`,
        time: Date.now() - state.time
    })
    state.time = Date.now()

    // 打印提示
    printHint(value, hint)

    // 判断胜负
    if (hint === "4A0B") {
        // 赢了
        console.table(formatHints(state.hints))
        console.log(chalk.bgGreen.bold(`你猜对了，答案就是${state.answer}~`))
    } else if (state.chance === 0) {
        // 输了
        console.table(formatHints(state.hints))
        console.log(chalk.bgRed.italic(`机会已用完，答案是${state.answer}，希望你下一次可以猜出来！`))
    }

    // 游戏未结束，数据存储完毕，如果还需要进行一些额外的操作，在这个函数中进行
    // 例如，普通模式在第五次猜测后，需要改变答案中的一个数字
    extraHandle()
}

// 改变答案中的一个数字
function changeOneNumber() {
    const randomIdx = Math.floor(Math.random() * 4)
    const arr = state.answer.split("")

    let newNumber = Math.floor(Math.random() * 10)

    while (arr.includes(`${newNumber}`)) {
        newNumber = Math.floor(Math.random() * 10)
    }

    arr[randomIdx] = newNumber

    state.answer = arr.join("")
    // console.log("🚀 ~ changeOneNumber ~ state.answer", state.answer)
}

// 不同模式的一些额外处理
function extraHandle() {
    if (state.mode === "general" && state.hints.length === 5) {
        changeOneNumber()
    }
}

main()