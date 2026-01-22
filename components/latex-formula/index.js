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
      // 如果有传入 nodes，则优先使用 nodes，忽略 formula
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

        // 忽略空白
        if (/\s/.test(char)) {
          i++;
          continue;
        }

        // 命令 (\frac, \mu, \min)
        if (char === '\\') {
          let cmd = '\\';
          i++;
          // 读取直到非字母或结束
          while (i < formula.length && /[a-zA-Z]/.test(formula[i])) {
            cmd += formula[i];
            i++;
          }
          tokens.push({ type: 'cmd', value: cmd });
          continue;
        }

        // 特殊符号
        if (['{', '}', '^', '_'].includes(char)) {
          tokens.push({ type: 'control', value: char });
          i++;
          continue;
        }

        // 普通字符 (数字, 字母, 运算符)
        tokens.push({ type: 'char', value: char });
        i++;
      }
      return tokens;
    },

    // 2. 语法分析 (Build AST)
    // 递归构建树
    buildAST(tokens) {
      const result = [];

      while (tokens.length > 0) {
        const token = tokens.shift();

        if (token.type === 'control' && token.value === '}') {
          // 遇到右括号，结束当前层级
          return result;
        }

        if (token.type === 'cmd') {
           const node = this.handleCommand(token.value, tokens);
           if (node) result.push(node);
        } else if (token.type === 'control' && token.value === '^') {
            // 上标，取出前一个元素作为基底（如果需要）或者直接作为独立的上标元素
            // 简单的实现：上标紧跟前一个元素，但在我们的 Flex 布局中，上标可以作为一个独立的 View 跟在后面
            const content = this.parseGroup(tokens);
            result.push({ type: 'sup', content });
        } else if (token.type === 'control' && token.value === '_') {
            // 下标
            const content = this.parseGroup(tokens);
            result.push({ type: 'sub', content });
        } else if (token.type === 'control' && token.value === '{') {
            // 显式组 { ... }
            const content = this.buildAST(tokens); // 递归直到 }
            result.push({ type: 'group', content });
        } else {
            // 普通字符处理
            result.push(this.handleChar(token.value));
        }
      }
      return result;
    },

    // 解析形如 { ... } 或 单个字符 的参数
    parseGroup(tokens) {
      if (tokens.length === 0) return [];

      const next = tokens[0];
      if (next.type === 'control' && next.value === '{') {
        tokens.shift(); // 消耗 {
        return this.buildAST(tokens); // buildAST 会消耗对应的 }
      } else {
        // 单个 Token 作为参数
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
       if (cmd === '\\min') {
           return { type: 'text', content: 'min', style: 'normal' };
       }
        if (cmd === '\\sqrt') {
           const content = this.parseGroup(tokens);
           return { type: 'sqrt', content: content };
       }

       if (cmd === '\\dot') {
           const content = this.parseGroup(tokens);
           // ˙ (U+02D9) Dot Above
           return { type: 'over', symbol: '˙', content: content };
       }

       if (['\\cos', '\\sin', '\\tan', '\\log', '\\ln', '\\exp'].includes(cmd)) {
           return { type: 'text', content: cmd.slice(1), style: 'normal' };
       }

       // 希腊字母与符号映射
       const map = {
           '\\mu': 'μ', '\\sigma': 'σ', '\\rho': 'ρ',
           '\\eta': 'η', '\\theta': 'θ', '\\gamma': 'γ',
           '\\delta': 'δ', '\\pi': 'π', '\\times': '×',
           '\\cdot': '·', '\\approx': '≈', '\\le': '≤',
           '\\ge': '≥', '\\pm': '±', '\\Delta': 'Δ',
           '\\epsilon': 'ε', '\\nu': 'ν', '\\omega': 'ω',
           '\\alpha': 'α', '\\beta': 'β', '\\tau': 'τ',
           '\\phi': 'φ', '\\lambda': 'λ'
       };

       if (map[cmd]) {
           return { type: 'symbol', content: map[cmd] };
       }

       return { type: 'text', content: cmd, style: 'normal' };
    },

    handleChar(char) {
        if (/[a-zA-Z]/.test(char)) {
            // 变量设为斜体
            return { type: 'text', content: char, style: 'italic' };
        }
        if (/[0-9]/.test(char)) {
             // 数字设为正体
            return { type: 'text', content: char, style: 'normal' };
        }
        // 其他符号
        return { type: 'symbol', content: char };
    }
  }
})
