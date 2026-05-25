function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function parseCondition(
  generatedData: Record<string, any>,
  conditionIf: object,
  conditionThen: any,
) {
  const entryIf = Object.entries(conditionIf)[0];
  const [pathIf, valueIf] = entryIf;

  const actualValue = getNestedValue(generatedData, pathIf);

  if (actualValue === undefined) {
    return false;
  }

  const expression = `${actualValue} ${valueIf}`;
  const postfix = infixToPostfix(expression);
  const result = calculatePostFix(postfix);

  return result ? conditionThen : false;
}
function infixToPostfix(expression: string): string {
  const precedence = {
    "||": 1,
    "&&": 2,
    "==": 3,
    "!=": 3,
    "===": 3,
    "!==": 3,
    "<": 4,
    "<=": 4,
    ">": 4,
    ">=": 4,
    "+": 5,
    "-": 5,
    "*": 6,
    "/": 6,
  };

  const stack = [];
  const result = [];

  const tokens = expression
    .split(/(\s+|>=|<=|==|!=|&&|\|\||>|<|\+|-|\*|\/)/)
    .filter((t) => t.trim() !== "");

  for (const token of tokens) {
    if (!precedence[token] && token !== "(" && token !== ")") {
      result.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        result.push(stack.pop());
      }
      stack.pop();
    } else {
      while (
        stack.length > 0 &&
        stack[stack.length - 1] !== "(" &&
        precedence[stack[stack.length - 1]] >= precedence[token]
      ) {
        result.push(stack.pop());
      }
      stack.push(token);
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop());
  }

  return result.join(" ");
}

function calculatePostFix(expression: string): boolean {
  const operators = [
    "||",
    "&&",
    "===",
    "!==",
    "==",
    "!=",
    ">",
    "<",
    ">=",
    "<=",
    "+",
    "-",
    "*",
    "/",
    "%",
  ];
  let stack = [];
  const tokens = expression
    .split(/(\s+|>=|<=|==|!=|&&|\|\||>|<|\+|-|\*|\/)/)
    .filter((t) => t.trim() !== "");
  for (const token of tokens) {
    if (!operators.includes(token)) {
      stack.push(token);
    } else {
      let b = stack.pop();
      let a = stack.pop();
      let result = calculate(a, b, token);
      if (result == undefined) return undefined;
      stack.push(result);
    }
  }
  if (stack.length === 1) return stack[0];
  return undefined;
}

function calculate(
  a: string | number | boolean,
  b: string | number | boolean,
  t: string,
): boolean {
  if (a === undefined || b === undefined) return undefined;
  const valA = isNaN(Number(a)) ? a : Number(a);
  const valB = isNaN(Number(b)) ? b : Number(b);

  if (t === ">") {
    return valA > valB;
  }
  if (t === "<") {
    return valA < valB;
  }
  if (t === ">=") {
    return valA >= valB;
  }
  if (t === "<=") {
    return valA <= valB;
  }
  if (t === "==") {
    return valA == valB;
  }
  if (t === "===") {
    return valA === valB;
  }
  if (t === "!=") {
    return valA != valB;
  }
  if (t === "!==") {
    return valA !== valB;
  }
  if (t === "&&") {
    return Boolean(valA && valB);
  }
  if (t === "||") {
    return Boolean(valA || valB);
  }

  return false;
}

export default parseCondition;
