class Lexer {
    constructor(expression) {
        this.expression = expression;
        this.pos = 0;
    }

    getNextToken() {
        if (this.pos >= this.expression.length) return null;

        let char = this.expression[this.pos];
        if (char === ' ') {
            this.pos++;
            return this.getNextToken();
        }

        if (char === '"' || char === "'") {
            return this.readString(char);
        }

        if (/\d/.test(char) || char === '.') {
            return this.readNumber();
        }

        if (/[a-zA-Z_]/.test(char)) {
            return this.readIdentifier();
        }

        if (char === '(') {
            this.pos++;
            return { type: 'left-paren', value: '(' };
        }

        if (char === ')') {
            this.pos++;
            return { type: 'right-paren', value: ')' };
        }

        if (char === ',') {
            this.pos++;
            return { type: 'comma', value: ',' };
        }

        throw new Error(`Unexpected character ${char}`);
    }

    readString(quote) {
        let start = this.pos;
        this.pos++;
        while (this.pos < this.expression.length) {
            let char = this.expression[this.pos];
            if (char === quote) {
                let value = this.expression.substring(start + 1, this.pos);
                this.pos++;
                return { type: 'string', value: value };
            }
            this.pos++;
        }
        throw new Error('Unclosed string');
    }

    readNumber() {
        let start = this.pos;
        let hasDot = false;
        while (this.pos < this.expression.length) {
            let char = this.expression[this.pos];
            if (char === '.' && !hasDot) {
                hasDot = true;
                this.pos++;
            } else if (/\d/.test(char)) {
                this.pos++;
            } else {
                break;
            }
        }
        let value = this.expression.substring(start, this.pos);
        return { type: 'number', value: parseFloat(value) };
    }

    readIdentifier() {
        let start = this.pos;
        while (this.pos < this.expression.length) {
            let char = this.expression[this.pos];
            if (/[a-zA-Z0-9_]/.test(char)) {
                this.pos++;
            } else {
                break;
            }
        }
        let value = this.expression.substring(start, this.pos);
        return { type: 'identifier', value: value };
    }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = lexer.getNextToken();
    }

    parse() {
        return this.parseExpression();
    }

    parseExpression() {
        const token = this.currentToken;
        if (token === null) throw new Error('Unexpected end of input');

        if (token.type === 'identifier') {
            const functionName = token.value;
            this.currentToken = this.lexer.getNextToken();
            if (this.currentToken === null) throw new Error('Unexpected end of input after identifier');
            if (this.currentToken.type === 'left-paren') {
                this.currentToken = this.lexer.getNextToken();
                const args = this.parseArguments();
                return { type: 'function', name: functionName, args: args };
            } else {
                return { type: 'variable', name: functionName };
            }
        } else if (token.type === 'string') {
            const value = token.value;
            this.currentToken = this.lexer.getNextToken();
            return { type: 'string', value: value };
        } else if (token.type === 'number') {
            const value = token.value;
            this.currentToken = this.lexer.getNextToken();
            return { type: 'number', value: value };
        } else {
            throw new Error(`Unexpected token type ${token.type}`);
        }
    }

    parseArguments() {
        const args = [];
        while (this.currentToken !== null && this.currentToken.type !== 'right-paren') {
            if (this.currentToken.type === 'comma') {
                this.currentToken = this.lexer.getNextToken();
            }
            const arg = this.parseExpression();
            args.push(arg);
        }
        if (this.currentToken === null) throw new Error('Unexpected end of input in arguments');
        if (this.currentToken.type === 'right-paren') {
            this.currentToken = this.lexer.getNextToken();
        }
        return args;
    }
}

function evaluate(node, methodMap, varMap) {
    switch (node.type) {
        case 'function':
            const args = node.args.map(arg => evaluate(arg, methodMap, varMap));
            const method = methodMap[node.name];
            if (typeof method === 'function') {
                return method(...args);
            } else {
                throw new Error(`Method ${node.name} not found`);
            }
        case 'variable':
            const value = varMap[node.name];
            if (value !== undefined) {
                return value;
            } else {
                throw new Error(`Variable ${node.name} not found`);
            }
        case 'string':
            return node.value;
        case 'number':
            return node.value;
        default:
            throw new Error(`Unknown node type ${node.type}`);
    }
}

// 示例用法
/**
const expression = 'ab(df, dg("d", ew(), eg("aa")), "sfe", 1)';
const lexer = new Lexer(expression);
const parser = new Parser(lexer);
const ast = parser.parse();
console.log('Abstract Syntax Tree:', ast);

const methodMap = {
    ab: (a, b, c, d) => a + b + c + d,
    df: () => 100,
    dg: (a, b, c) => a + b + c,
    ew: () => 200,
    eg: (a) => a.length,
};

const varMap = {};

try {
    const result = evaluate(ast, methodMap, varMap);
    console.log('Result:', result);
} catch (error) {
    console.error('Error:', error);
}
 * 
 */

