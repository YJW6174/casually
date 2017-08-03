var input = '{"a":111,"b":{"c":222, "dd11": {"f": 333}}}'
var LBRACE = 'LBRACE'
var RBRACE = 'RBRACE'
var COMMA = 'COMMA'
var COLON = 'COLON'
var IDENTIFIER = 'IDENTIFIER'
var NUMBER = 'NUMBER'
var QUOTA = 'QUOTA'
var EOF = 'EOF'

function end() {}

function Token(type, value) {
    this.type = type
    this.value = value
}

function Tokenizer(input) {
    this.input = input
    this.curIndex = -1
    this.skipWS = function() {
        while (this.curChar === ' ' || //空字符串
            this.curChar === '\t' || // \t 是啥?
            this.curChar === '\n' || // \n 换行
            this.curChar === '\r') { // \r 换
            this.nextChar()
        }
    }
    this.nextChar = function() {
        if (this.curIndex === (this.input.length - 1)) {
            this.curChar = end
            return
        }
        this.curChar = this.input[++this.curIndex]
    }
    this.isLetter = function(char) {
        return (char <= 'z' && char >= 'a') ||
            (char <= 'Z' && char >= 'A')
    }
    this.isNumber = function(char) {
        return char >= '0' && char <= '9'
    }
    this.getIdentifier = function() {
        var ident = ''
        do {
            ident += this.curChar
            this.nextChar()
        } while (this.isLetter(this.curChar))
        return ident
    }
    this.getNumber = function() {
        var number = ''
        do {
            number += this.curChar
            this.nextChar()
        } while (this.isNumber(this.curChar))
        return number
    }
    this.getNextToken = function() {
        this.skipWS()
        switch (this.curChar) {
            case '{':
                this.nextChar()
                return new Token(LBRACE, '{')
            case '}':
                this.nextChar()
                return new Token(RBRACE, '}')
            case ',':
                this.nextChar()
                return new Token(COMMA, ',')
            case ':':
                this.nextChar()
                return new Token(COLON, ':')
            case '"':
            case "'":
                var quota = this.curChar
                this.nextChar()
                return new Token(QUOTA, quota)
            case end:
                return new Token(EOF, this.curChar)
            default:
                if (this.isLetter(this.curChar)) {
                    var ident = this.getIdentifier()
                    return new Token(IDENTIFIER, ident)
                }
                if (this.isNumber(this.curChar)) {
                    var number = this.getNumber()
                    return new Token(NUMBER, number)
                }

        }
    }
    this.nextChar()
}
// '{"a":1,"b11":"111"}'
function Parser(input) {
    this.tokenizer = new Tokenizer(input)
    this.parse = function() {
        var res
        while (this.curToken.type !== EOF) {
            res = this.parseJSON()
            this.nextToken()
        }
        return res
    }
    this.parseJSON = function() {
        if (this.curToken.type !==
            LBRACE) { //token { 标志着json开始
            return null
        }
        var json = {}
        this.parseStatements(json) //  statements
        if (!this.expectPeek(RBRACE)) { //token } 标志着json的结束
            return null
        }
        return json
    }
    this.parseStatements = function(json) {
        do {
            this.parseStatement(json) // statement
        } while (this.expectPeek(COMMA)) // 由逗号分隔
    }
    this.parseStatement = function(json) {
        if (!this.expectPeek(QUOTA)) {
            return null
        }
        var key = this.parseString() // key
        if (!this.expectPeek(COLON)) { // 冒号
            return null
        }
        var value = this.parseItem() // 值
        json[key] = value
    }
    this.parseString = function() {
        var key = ''
        // string由"开头 中间是一系列的identifier或者number
        // 由"结尾，这里一系列的identifier或者number翻译成了while语句
        while (!this.expectPeek(QUOTA)) {
            this.nextToken()
            key += this.curToken.value
        }
        if (key.length === 0) {
            return null
        }
        return key
    }
    this.parseItem = function() {
        if (this.expectPeek(NUMBER)) { // 值可能是number
            return this.curToken.value
        }
        if (this.expectPeek(LBRACE)) { // 可能是json
            return this.parseJSON()
        }
        if (this.expectPeek(QUOTA)) { // 可能是string
            return this.parseString()
        }
        return null
    }
    this.nextToken = function() {
        this.curToken = this.peekToken
        this.peekToken = this.tokenizer.getNextToken()
    }
    this.expectPeek = function(type) {
        if (this.peekToken.type === type) {
            this.nextToken()
            return true
        }
        return false
    }
    this.nextToken()
    this.nextToken()
}