/** 
 * 入力した文字列を出力するための関数
 * 
 * @param text:出力する文字列
 * @param breakLine:改行するかどうかの真偽値
 * 
 */
const printLine = (text: string, breakLine: boolean = true) => {
    process.stdout.write(text + (breakLine ? '\n' : ''))
}

/**
 * readLineメソッド
 */
const readLine = async () => {
    // ユーザからの入力を待つために非同期
    // 入力内容はBuffer型で返却されるため、toString()で文字列に変換
    const input: string = await new Promise((resolve) => process.stdin.once('data', (data) => resolve(data.toString())))
    // 改行コードを取り除く
    return input.trim()
}

/**
 * ユーザに質問を投げかけ、入力してもらうための関数
 * 
 * @returns ユーザが入力したテキスト
 */
const promptInput = async (text: string) => {
    // 質問を投げかける
    printLine(`\n${text}\n>`, false)

    return readLine()
}

/**
 * promptSelectメソッド
 * 
 * @param text: 
 * @param value: 
 * 
 * @returns 
 */
const promptSelect = async <T extends string>(text: string, values: readonly T[]): Promise<T> => {
    printLine(`\n${text}`)
    values.forEach((value) => {
        printLine(`- ${value}`)
    })
    printLine(`> `, false)

    const input = (await readLine()) as T
    if (values.includes(input)) {
        return input
    } else {
        return promptSelect<T>(text, values)
    }
}


/**
 * ゲームモードの型定義（タイプエイリアス）
 */
const modes = ['normal', 'hard'] as const
type Mode = typeof modes[number]


/**
 * HitAndBlowクラス
 * 
 * @param answerSource 回答の選択肢となりえる文字列の配列
 * @param answer ユーザの回答の文字列の配列
 * @param tryCount 試行回数
 * @param mode ゲームのモード
 */
class HitAndBlow {
    private readonly answerSource = ['0','1','2','3','4','5','6','7','8','9']
    private answer: string[] = [] // answerは初期値がないため型推論できない
    private tryCount = 0
    private mode: Mode = 'normal'

    /**
     * settingメソッド
     * 
     * @param randNum answerSourceの中から抽出した任意の数値
     * @param selectedItem 選択済みの数値
     * 
     * 解答となる数字の組み合わせを設定
     */
    async setting() {
        this.mode = await promptSelect<Mode>('モードを入力して下さい。', modes)
        // 解答になる文字列の長さ（数列となる）
        const answerLength = this.getAnswerLength()

        while(this.answer.length < answerLength) {
            const randNum = Math.floor(Math.random() * this.answerSource.length)
            // answerSourceの中から任意の数字を選択
            const selectedItem = this.answerSource[randNum]
            // ランダムに生成されたselectedItemが既にpushされた数列に存在しない場合、pushする
            if(!this.answer.includes(selectedItem)) {
                this.answer.push(selectedItem)
            } 
        }
    }

    /**
     * playメソッド
     * 
     * ユーザが入力した数値を保持する
     */
    async play() {
        // ユーザの入力値を配列形式で保持
        const answerLength = this.getAnswerLength()
        const inputAttr = (await promptInput(`「,」区切りで${answerLength}つの数字を入力してください`)).split(',')
        
        if(!this.validation(inputAttr)) {
            printLine('無効な入力です')
            await this.play()
            return
        }
        
        const result = this.check(inputAttr)
        
        if (result.hit !== this.answer.length) {
            // 不正解だったら続ける
            printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
            this.tryCount += 1
            await this.play()
        } else {
            // 正解だったら修了
            this.tryCount += 1
        }
    }

    /**
     * endメソッド
     */
    end() {
        printLine(`正解です！\n試行回数:${this.tryCount}回`)
        process.exit()
    }

    /**
     * checkメソッド
     */
    private check(input: string[]) {
        let hitCount = 0
        let blowCount  = 0

        input.forEach((val, index) => {
            if(val === this.answer[index]) {
                hitCount += 1
            } else {
                blowCount += 1
            }
        })

        return {
            hit: hitCount,
            blow: blowCount,
        }
    }

    /**
     * validationメソッド
     */
    private validation(inputAttr: string[]) {
        // 文字列の長さを判定
        const isLengthValid = this.answer.length == inputAttr.length
        // 文字列が、「answerSource」に含まれるいずれかの文字列であることを判定
        const isAllAnswerSourceOption = inputAttr.every((val) => this.answerSource.includes(val))
        // 文字列に重複がないことを判定
        const isAlllDifferentValues = inputAttr.every((val, i) => inputAttr.indexOf(val) === i)
        return isLengthValid && isAllAnswerSourceOption && isAlllDifferentValues
    }

    /**
     * getAnswerLengthメソッド
     */
    private getAnswerLength() {
        switch(this.mode) {
            case 'normal':
                return 3
            case 'hard':
                return 4
            default : 
                const neverValue: never = this.mode
                throw new Error(`${neverValue}は無効なモードです`)
        }
    }
}


// 動作確認用の為コメントアウト
;(async () =>{
    const hitAndBlow = new HitAndBlow()
    await hitAndBlow.setting()
    await hitAndBlow.play()
    hitAndBlow.end()
})()

