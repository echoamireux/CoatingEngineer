const formula = "CPK = \\min \\frac{USL-\\mu}{3\\sigma}, \\frac{\mu-LSL}{3\\sigma}";

function tokenize(formula) {
  const tokens = [];
  let i = 0;

  while (i < formula.length) {
    const char = formula[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === '\\') {
      let cmd = '\\';
      i++;
      while (i < formula.length && /[a-zA-Z]/.test(formula[i])) {
        cmd += formula[i];
        i++;
      }
      tokens.push({ type: 'cmd', value: cmd });
      continue;
    }

    if (['{', '}', '^', '_'].includes(char)) {
      tokens.push({ type: 'control', value: char });
      i++;
      continue;
    }

    tokens.push({ type: 'char', value: char });
    i++;
  }
  return tokens;
}

function buildAST(tokens) {
  const result = [];

  while (tokens.length > 0) {
    const token = tokens.shift();

    if (token.type === 'control' && token.value === '}') {
      return result;
    }

    if (token.type === 'cmd') {
       const node = handleCommand(token.value, tokens);
       if (node) result.push(node);
    } else if (token.type === 'control' && token.value === '^') {
        const content = parseGroup(tokens);
        result.push({ type: 'sup', content });
    } else if (token.type === 'control' && token.value === '_') {
        const content = parseGroup(tokens);
        result.push({ type: 'sub', content });
    } else if (token.type === 'control' && token.value === '{') {
        const content = buildAST(tokens);
        result.push({ type: 'group', content });
    } else {
        result.push(handleChar(token.value));
    }
  }
  return result;
}

function parseGroup(tokens) {
  if (tokens.length === 0) return [];

  const next = tokens[0];
  if (next.type === 'control' && next.value === '{') {
    tokens.shift();
    return buildAST(tokens);
  } else {
    const token = tokens.shift();
    if (token.type === 'cmd') {
        return [handleCommand(token.value, tokens)];
    }
    return [handleChar(token.value)];
  }
}

function handleCommand(cmd, tokens) {
   if (cmd === '\\frac') {
       const num = parseGroup(tokens);
       const den = parseGroup(tokens);
       return { type: 'frac', numerator: num, denominator: den };
   }
   if (cmd === '\\min') {
       return { type: 'text', content: 'min', style: 'normal' };
   }
   if (cmd === '\\sqrt') {
       const content = parseGroup(tokens);
       return { type: 'sqrt', content: content };
   }

   const map = {
       '\\mu': 'μ', '\\sigma': 'σ', '\\rho': 'ρ',
       '\\eta': 'η', '\\theta': 'θ', '\\gamma': 'γ',
       '\\delta': 'δ', '\\pi': 'π', '\\times': '×',
       '\\cdot': '·', '\\approx': '≈', '\\le': '≤',
       '\\ge': '≥', '\\pm': '±', '\\Delta': 'Δ'
   };

   if (map[cmd]) {
       return { type: 'symbol', content: map[cmd] };
   }

   return { type: 'text', content: cmd, style: 'normal' };
}

function handleChar(char) {
    if (/[a-zA-Z]/.test(char)) {
        return { type: 'text', content: char, style: 'italic' };
    }
    if (/[0-9]/.test(char)) {
        return { type: 'text', content: char, style: 'normal' };
    }
    return { type: 'symbol', content: char };
}

const tokens = tokenize(formula);
console.log("Tokens:", JSON.stringify(tokens, null, 2));

const ast = buildAST(tokens);
console.log("AST:", JSON.stringify(ast, null, 2));
