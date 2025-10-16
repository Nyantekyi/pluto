// Token types
export const TokenType = {
  // Keywords
  CHECK: 'CHECK',
  ELSE: 'ELSE',
  EACH: 'EACH',
  AS: 'AS',
  ACTION: 'ACTION',
  END: 'END',
  IN: 'IN',
  
  // Identifiers and literals
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  
  // Operators
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  MODULO: 'MODULO',
  ASSIGN: 'ASSIGN',
  EQUAL: 'EQUAL',
  NOT_EQUAL: 'NOT_EQUAL',
  LESS_THAN: 'LESS_THAN',
  GREATER_THAN: 'GREATER_THAN',
  LESS_EQUAL: 'LESS_EQUAL',
  GREATER_EQUAL: 'GREATER_EQUAL',
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  
  // Punctuation
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  LBRACE: 'LBRACE',
  RBRACE: 'RBRACE',
  LBRACKET: 'LBRACKET',
  RBRACKET: 'RBRACKET',
  COMMA: 'COMMA',
  DOT: 'DOT',
  
  // Special
  NEWLINE: 'NEWLINE',
  EOF: 'EOF',
};

const KEYWORDS = {
  'check': TokenType.CHECK,
  'else': TokenType.ELSE,
  'each': TokenType.EACH,
  'as': TokenType.AS,
  'action': TokenType.ACTION,
  'end': TokenType.END,
  'in': TokenType.IN,
  'true': TokenType.BOOLEAN,
  'false': TokenType.BOOLEAN,
};

export class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  peek(offset = 0) {
    const pos = this.position + offset;
    return pos < this.input.length ? this.input[pos] : null;
  }

  advance() {
    const char = this.input[this.position];
    this.position++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  skipWhitespace() {
    while (this.peek() && /[ \t\r]/.test(this.peek())) {
      this.advance();
    }
  }

  skipComment() {
    if (this.peek() === '/' && this.peek(1) === '/') {
      while (this.peek() && this.peek() !== '\n') {
        this.advance();
      }
    }
  }

  readNumber() {
    const startLine = this.line;
    const startColumn = this.column;
    let num = '';
    let hasDecimal = false;

    while (this.peek() && (/[0-9]/.test(this.peek()) || (this.peek() === '.' && !hasDecimal))) {
      if (this.peek() === '.') {
        hasDecimal = true;
      }
      num += this.advance();
    }

    return new Token(TokenType.NUMBER, parseFloat(num), startLine, startColumn);
  }

  readString() {
    const startLine = this.line;
    const startColumn = this.column;
    const quote = this.advance(); // consume opening quote
    let str = '';

    while (this.peek() && this.peek() !== quote) {
      if (this.peek() === '\\') {
        this.advance(); // consume backslash
        const next = this.advance();
        switch (next) {
          case 'n': str += '\n'; break;
          case 't': str += '\t'; break;
          case 'r': str += '\r'; break;
          case '\\': str += '\\'; break;
          case '"': str += '"'; break;
          case "'": str += "'"; break;
          default: str += next;
        }
      } else {
        str += this.advance();
      }
    }

    if (this.peek() !== quote) {
      throw new Error(`Unterminated string at line ${startLine}, column ${startColumn}`);
    }

    this.advance(); // consume closing quote
    return new Token(TokenType.STRING, str, startLine, startColumn);
  }

  readIdentifier() {
    const startLine = this.line;
    const startColumn = this.column;
    let id = '';

    while (this.peek() && /[a-zA-Z0-9_]/.test(this.peek())) {
      id += this.advance();
    }

    const type = KEYWORDS[id] || TokenType.IDENTIFIER;
    const value = type === TokenType.BOOLEAN ? id === 'true' : id;

    return new Token(type, value, startLine, startColumn);
  }

  tokenize() {
    while (this.position < this.input.length) {
      this.skipWhitespace();

      if (this.position >= this.input.length) break;

      const char = this.peek();
      const startLine = this.line;
      const startColumn = this.column;

      // Skip comments
      if (char === '/' && this.peek(1) === '/') {
        this.skipComment();
        continue;
      }

      // Newlines
      if (char === '\n') {
        this.advance();
        this.tokens.push(new Token(TokenType.NEWLINE, '\n', startLine, startColumn));
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      // Strings
      if (char === '"' || char === "'") {
        this.tokens.push(this.readString());
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      // Two-character operators
      if (char === '=' && this.peek(1) === '=') {
        this.advance();
        this.advance();
        this.tokens.push(new Token(TokenType.EQUAL, '==', startLine, startColumn));
        continue;
      }

      if (char === '!' && this.peek(1) === '=') {
        this.advance();
        this.advance();
        this.tokens.push(new Token(TokenType.NOT_EQUAL, '!=', startLine, startColumn));
        continue;
      }

      if (char === '<' && this.peek(1) === '=') {
        this.advance();
        this.advance();
        this.tokens.push(new Token(TokenType.LESS_EQUAL, '<=', startLine, startColumn));
        continue;
      }

      if (char === '>' && this.peek(1) === '=') {
        this.advance();
        this.advance();
        this.tokens.push(new Token(TokenType.GREATER_EQUAL, '>=', startLine, startColumn));
        continue;
      }

      if (char === '&' && this.peek(1) === '&') {
        this.advance();
        this.advance();
        this.tokens.push(new Token(TokenType.AND, '&&', startLine, startColumn));
        continue;
      }

      if (char === '|' && this.peek(1) === '|') {
        this.advance();
        this.advance();
        this.tokens.push(new Token(TokenType.OR, '||', startLine, startColumn));
        continue;
      }

      // Single-character tokens
      const singleChar = {
        '+': TokenType.PLUS,
        '-': TokenType.MINUS,
        '*': TokenType.MULTIPLY,
        '/': TokenType.DIVIDE,
        '%': TokenType.MODULO,
        '=': TokenType.ASSIGN,
        '<': TokenType.LESS_THAN,
        '>': TokenType.GREATER_THAN,
        '!': TokenType.NOT,
        '(': TokenType.LPAREN,
        ')': TokenType.RPAREN,
        '{': TokenType.LBRACE,
        '}': TokenType.RBRACE,
        '[': TokenType.LBRACKET,
        ']': TokenType.RBRACKET,
        ',': TokenType.COMMA,
        '.': TokenType.DOT,
      };

      if (singleChar[char]) {
        this.advance();
        this.tokens.push(new Token(singleChar[char], char, startLine, startColumn));
        continue;
      }

      throw new Error(`Unexpected character '${char}' at line ${startLine}, column ${startColumn}`);
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
    return this.tokens;
  }
}
