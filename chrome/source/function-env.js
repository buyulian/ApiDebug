function evaluateExpression(str, methodMap, varMap) {
    var str1 = decodeURIComponent(str)
    var str2 = str1.replace(/{{(.*?)}}/g, (match, expr) => {
        var str11 = exeFunctionAndReturnStr(expr, methodMap, varMap)
        return str11;
    });
    return str2;
}

function exeFunctionAndReturnStr(expression, methodMap, varMap) {
    const lexer = new Lexer(expression);
    const parser = new Parser(lexer);
    const ast = parser.parse();
    console.log('Abstract Syntax Tree:', ast);
    try {
        const result = evaluate(ast, methodMap, varMap);
        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error:', error, expression);
        return expression;
    }
}
