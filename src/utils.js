// 检测输入的数字是否符合要求
exports.checkInput = str => /^\d{4}$/.test(str) && (new Set(str)).size === 4

// 生成答案
exports.initAnswer = () => {
    const arr = [...new Array(10).keys()]
    const result = []
    for (let i = 0; i < 4; i++) {
        const idx = Math.floor(Math.random() * arr.length)
        result.push(`${arr[idx]}`)
        arr.splice(idx, 1)
    }
    return result.join("")
}

// 生成提示
exports.generlateHint = (myNumber, answer) => {
    let a = 0, b = 0
    for (let i = 0; i < 4; i++) {
        const idx = answer.indexOf(myNumber.charAt(i))
        if (idx === -1) continue
        else if (idx === i) a++
        else b++
    }
    return `${a}A${b}B`
}


