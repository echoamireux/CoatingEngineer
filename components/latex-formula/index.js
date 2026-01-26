// components/latex-formula/index.js
Component({
  properties: {
    nodes: {
      type: Array,
      value: [],
      observer: 'onNodesChange'
    },
    formula: {
      type: String,
      value: '',
      observer: 'parse'
    },
    color: {
      type: String,
      value: 'currentColor'
    },
    justify: {
      type: String,
      value: 'center' // center | flex-start | flex-end
    }
  },

  data: {
    ast: []
  },

  methods: {
    onNodesChange(newVal) {
      if (newVal && newVal.length > 0) {
        this.setData({ ast: newVal });
      }
    },

    parse(formula) {
      if (this.properties.nodes && this.properties.nodes.length > 0) return;

      if (!formula) return;
      const tokens = this.tokenize(formula);
      const ast = this.buildAST(tokens);
      this.setData({ ast });
    },

    // 1. 词法分析 (Tokenizer)
    tokenize(formula) {
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

          if (i < formula.length) {
              if (/[a-zA-Z]/.test(formula[i])) {
                  // 读取字母序列
                  while (i < formula.length && /[a-zA-Z]/.test(formula[i])) {
                    cmd += formula[i];
                    i++;
                  }
              } else {
                  // 读取单个非字母字符 (如 \%, \,)
                  cmd += formula[i];
                  i++;
              }
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
    },

    // 2. 语法分析 (Build AST)
    buildAST(tokens) {
      const result = [];

      while (tokens.length > 0) {
        const token = tokens.shift();

        if (token.type === 'control' && token.value === '}') {
          return result;
        }

        if (token.type === 'cmd') {
           const node = this.handleCommand(token.value, tokens);
           if (node) result.push(node);
        } else if (token.type === 'control' && token.value === '^') {
            const content = this.parseGroup(tokens);
            result.push({ type: 'sup', content });
        } else if (token.type === 'control' && token.value === '_') {
            const content = this.parseGroup(tokens);
            result.push({ type: 'sub', content });
        } else if (token.type === 'control' && token.value === '{') {
            const content = this.buildAST(tokens);
            result.push({ type: 'group', content });
        } else {
            result.push(this.handleChar(token.value));
        }
      }
      return result;
    },

    parseGroup(tokens) {
      if (tokens.length === 0) return [];

      const next = tokens[0];
      if (next.type === 'control' && next.value === '{') {
        tokens.shift();
        return this.buildAST(tokens);
      } else {
        const token = tokens.shift();
        if (token.type === 'cmd') {
            return [this.handleCommand(token.value, tokens)];
        }
        return [this.handleChar(token.value)];
      }
    },

    handleCommand(cmd, tokens) {
       if (cmd === '\\frac') {
           const num = this.parseGroup(tokens);
           const den = this.parseGroup(tokens);
           return { type: 'frac', numerator: num, denominator: den };
       }
       if (cmd === '\\text') {
           const content = this.parseGroup(tokens);
           // 标记为 text-mode，渲染时去除 unwanted spacing
           return { type: 'group', content: content, className: 'latex-text-mode' };
       }
       if (cmd === '\\min') {
           return { type: 'text', content: 'min', style: 'normal' };
       }
        if (cmd === '\\sqrt') {
           const content = this.parseGroup(tokens);
           return { type: 'sqrt', content: content };
       }

       if (cmd === '\\dot') {
           const content = this.parseGroup(tokens);
           return { type: 'over', symbol: '˙', content: content };
       }

       if (['\\cos', '\\sin', '\\tan', '\\log', '\\ln', '\\exp'].includes(cmd)) {
           return { type: 'text', content: cmd.slice(1), style: 'normal' };
       }

       const map = {
           '\\mu': 'μ', '\\sigma': 'σ', '\\rho': 'ρ',
           '\\eta': 'η', '\\theta': 'θ', '\\gamma': 'γ',
           '\\delta': 'δ', '\\pi': 'π', '\\times': '×',
           '\\cdot': '·', '\\approx': '≈', '\\le': '≤',
           '\\ge': '≥', '\\pm': '±', '\\Delta': 'Δ',
           '\\epsilon': 'ε', '\\nu': 'ν', '\\omega': 'ω',
           '\\alpha': 'α', '\\beta': 'β', '\\tau': 'τ',
           '\\phi': 'φ', '\\lambda': 'λ', '\\sum': '∑',
           '\\%': '%', '\\sim': '~'
       };

       if (map[cmd]) {
           return { type: 'symbol', content: map[cmd] };
       }

       return { type: 'text', content: cmd, style: 'normal' };
    },

    handleChar(char) {
        // CJK 字符：视为文本
        if (/[\u4e00-\u9fa5]/.test(char)) {
            return { type: 'text', content: char, style: 'normal' };
        }
        if (/[a-zA-Z]/.test(char)) {
            return { type: 'text', content: char, style: 'italic' };
        }
        if (/[0-9]/.test(char)) {
            return { type: 'text', content: char, style: 'normal' };
        }
        return { type: 'symbol', content: char };
    }
  }
})
