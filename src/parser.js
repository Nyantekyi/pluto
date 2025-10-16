import { TokenType } from './lexer.js';

// AST Node Types
export class ASTNode {
  constructor(type) {
    this.type = type;
  }
}

export class Program extends ASTNode {
  constructor(statements) {
    super('Program');
    this.statements = statements;
  }
}

export class NodeDeclaration extends ASTNode {
  constructor(name, value) {
    super('NodeDeclaration');
    this.name = name;
    this.value = value;
  }
}

export class ActionDeclaration extends ASTNode {
  constructor(name, params, body) {
    super('ActionDeclaration');
    this.name = name;
    this.params = params;
    this.body = body;
  }
}

export class CheckStatement extends ASTNode {
  constructor(condition, consequent, alternate) {
    super('CheckStatement');
    this.condition = condition;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

export class EachStatement extends ASTNode {
  constructor(variable, iterable, body) {
    super('EachStatement');
    this.variable = variable;
    this.iterable = iterable;
    this.body = body;
  }
}

export class AsStatement extends ASTNode {
  constructor(condition, body) {
    super('AsStatement');
    this.condition = condition;
    this.body = body;
  }
}

export class BinaryExpression extends ASTNode {
  constructor(operator, left, right) {
    super('BinaryExpression');
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class UnaryExpression extends ASTNode {
  constructor(operator, argument) {
    super('UnaryExpression');
    this.operator = operator;
    this.argument = argument;
  }
}

export class CallExpression extends ASTNode {
  constructor(callee, args) {
    super('CallExpression');
    this.callee = callee;
    this.args = args;
  }
}

export class MemberExpression extends ASTNode {
  constructor(object, property, computed) {
    super('MemberExpression');
    this.object = object;
    this.property = property;
    this.computed = computed;
  }
}

export class ArrayExpression extends ASTNode {
  constructor(elements) {
    super('ArrayExpression');
    this.elements = elements;
  }
}

export class Identifier extends ASTNode {
  constructor(name) {
    super('Identifier');
    this.name = name;
  }
}

export class Literal extends ASTNode {
  constructor(value) {
    super('Literal');
    this.value = value;
  }
}

export class BlockStatement extends ASTNode {
  constructor(statements) {
    super('BlockStatement');
    this.statements = statements;
  }
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE); // Filter out newlines for easier parsing
    this.position = 0;
  }

  current() {
    return this.tokens[this.position];
  }

  peek(offset = 1) {
    return this.tokens[this.position + offset];
  }

  advance() {
    return this.tokens[this.position++];
  }

  expect(type, message) {
    const token = this.current();
    if (!token || token.type !== type) {
      throw new Error(message || `Expected ${type} but got ${token?.type} at line ${token?.line}`);
    }
    return this.advance();
  }

  match(...types) {
    const token = this.current();
    return token && types.includes(token.type);
  }

  parse() {
    const statements = [];
    
    while (this.current() && this.current().type !== TokenType.EOF) {
      statements.push(this.parseStatement());
    }
    
    return new Program(statements);
  }

  parseStatement() {
    if (this.match(TokenType.ACTION)) {
      return this.parseActionDeclaration();
    }
    
    if (this.match(TokenType.CHECK)) {
      return this.parseCheckStatement();
    }
    
    if (this.match(TokenType.EACH)) {
      return this.parseEachStatement();
    }
    
    if (this.match(TokenType.AS)) {
      return this.parseAsStatement();
    }
    
    return this.parseExpressionStatement();
  }

  parseActionDeclaration() {
    this.expect(TokenType.ACTION);
    const name = this.expect(TokenType.IDENTIFIER).value;
    
    this.expect(TokenType.LPAREN);
    const params = [];
    
    if (!this.match(TokenType.RPAREN)) {
      do {
        params.push(this.expect(TokenType.IDENTIFIER).value);
        if (this.match(TokenType.COMMA)) {
          this.advance();
        }
      } while (!this.match(TokenType.RPAREN));
    }
    
    this.expect(TokenType.RPAREN);
    
    const body = this.parseBlock();
    
    this.expect(TokenType.END);
    
    return new ActionDeclaration(name, params, body);
  }

  parseCheckStatement() {
    this.expect(TokenType.CHECK);
    this.expect(TokenType.LPAREN);
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN);
    
    const consequent = this.parseBlock();
    
    let alternate = null;
    if (this.match(TokenType.ELSE)) {
      this.advance();
      alternate = this.parseBlock();
    }
    
    this.expect(TokenType.END);
    
    return new CheckStatement(condition, consequent, alternate);
  }

  parseEachStatement() {
    this.expect(TokenType.EACH);
    this.expect(TokenType.LPAREN);
    const variable = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.IN);
    const iterable = this.parseExpression();
    this.expect(TokenType.RPAREN);
    
    const body = this.parseBlock();
    
    this.expect(TokenType.END);
    
    return new EachStatement(variable, iterable, body);
  }

  parseAsStatement() {
    this.expect(TokenType.AS);
    this.expect(TokenType.LPAREN);
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN);
    
    const body = this.parseBlock();
    
    this.expect(TokenType.END);
    
    return new AsStatement(condition, body);
  }

  parseBlock() {
    const statements = [];
    
    while (!this.match(TokenType.END, TokenType.ELSE, TokenType.EOF)) {
      statements.push(this.parseStatement());
    }
    
    return new BlockStatement(statements);
  }

  parseExpressionStatement() {
    // Check if this is an assignment
    if (this.match(TokenType.IDENTIFIER) && this.peek()?.type === TokenType.ASSIGN) {
      const name = this.advance().value;
      this.advance(); // consume =
      const value = this.parseExpression();
      return new NodeDeclaration(name, value);
    }
    
    return this.parseExpression();
  }

  parseExpression() {
    return this.parseLogicalOr();
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd();
    
    while (this.match(TokenType.OR)) {
      const operator = this.advance().value;
      const right = this.parseLogicalAnd();
      left = new BinaryExpression(operator, left, right);
    }
    
    return left;
  }

  parseLogicalAnd() {
    let left = this.parseEquality();
    
    while (this.match(TokenType.AND)) {
      const operator = this.advance().value;
      const right = this.parseEquality();
      left = new BinaryExpression(operator, left, right);
    }
    
    return left;
  }

  parseEquality() {
    let left = this.parseRelational();
    
    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.advance().value;
      const right = this.parseRelational();
      left = new BinaryExpression(operator, left, right);
    }
    
    return left;
  }

  parseRelational() {
    let left = this.parseAdditive();
    
    while (this.match(TokenType.LESS_THAN, TokenType.GREATER_THAN, TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
      const operator = this.advance().value;
      const right = this.parseAdditive();
      left = new BinaryExpression(operator, left, right);
    }
    
    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.advance().value;
      const right = this.parseMultiplicative();
      left = new BinaryExpression(operator, left, right);
    }
    
    return left;
  }

  parseMultiplicative() {
    let left = this.parseUnary();
    
    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const operator = this.advance().value;
      const right = this.parseUnary();
      left = new BinaryExpression(operator, left, right);
    }
    
    return left;
  }

  parseUnary() {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.advance().value;
      const argument = this.parseUnary();
      return new UnaryExpression(operator, argument);
    }
    
    return this.parsePostfix();
  }

  parsePostfix() {
    let expr = this.parsePrimary();
    
    while (true) {
      if (this.match(TokenType.LPAREN)) {
        // Function call
        this.advance();
        const args = [];
        
        if (!this.match(TokenType.RPAREN)) {
          do {
            args.push(this.parseExpression());
            if (this.match(TokenType.COMMA)) {
              this.advance();
            }
          } while (!this.match(TokenType.RPAREN));
        }
        
        this.expect(TokenType.RPAREN);
        expr = new CallExpression(expr, args);
      } else if (this.match(TokenType.LBRACKET)) {
        // Array access
        this.advance();
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET);
        expr = new MemberExpression(expr, index, true);
      } else if (this.match(TokenType.DOT)) {
        // Member access
        this.advance();
        const property = this.expect(TokenType.IDENTIFIER).value;
        expr = new MemberExpression(expr, new Identifier(property), false);
      } else {
        break;
      }
    }
    
    return expr;
  }

  parsePrimary() {
    // Number literal
    if (this.match(TokenType.NUMBER)) {
      return new Literal(this.advance().value);
    }
    
    // String literal
    if (this.match(TokenType.STRING)) {
      return new Literal(this.advance().value);
    }
    
    // Boolean literal
    if (this.match(TokenType.BOOLEAN)) {
      return new Literal(this.advance().value);
    }
    
    // Identifier
    if (this.match(TokenType.IDENTIFIER)) {
      return new Identifier(this.advance().value);
    }
    
    // Array literal
    if (this.match(TokenType.LBRACKET)) {
      this.advance();
      const elements = [];
      
      if (!this.match(TokenType.RBRACKET)) {
        do {
          elements.push(this.parseExpression());
          if (this.match(TokenType.COMMA)) {
            this.advance();
          }
        } while (!this.match(TokenType.RBRACKET));
      }
      
      this.expect(TokenType.RBRACKET);
      return new ArrayExpression(elements);
    }
    
    // Parenthesized expression
    if (this.match(TokenType.LPAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN);
      return expr;
    }
    
    const token = this.current();
    throw new Error(`Unexpected token ${token?.type} at line ${token?.line}`);
  }
}
