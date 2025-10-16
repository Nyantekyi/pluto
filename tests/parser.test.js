import { describe, it, expect } from 'vitest';
import { Lexer } from '../src/lexer.js';
import { Parser, NodeDeclaration, BinaryExpression, Identifier, Literal, ActionDeclaration, CheckStatement, EachStatement, AsStatement, CallExpression } from '../src/parser.js';

function parse(code) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

describe('Parser', () => {
  it('should parse number literals', () => {
    const ast = parse('42');
    expect(ast.statements[0]).toBeInstanceOf(Literal);
    expect(ast.statements[0].value).toBe(42);
  });

  it('should parse string literals', () => {
    const ast = parse('"hello"');
    expect(ast.statements[0]).toBeInstanceOf(Literal);
    expect(ast.statements[0].value).toBe('hello');
  });

  it('should parse boolean literals', () => {
    const ast = parse('true');
    expect(ast.statements[0]).toBeInstanceOf(Literal);
    expect(ast.statements[0].value).toBe(true);
  });

  it('should parse identifiers', () => {
    const ast = parse('x');
    expect(ast.statements[0]).toBeInstanceOf(Identifier);
    expect(ast.statements[0].name).toBe('x');
  });

  it('should parse node declarations (assignments)', () => {
    const ast = parse('x = 10');
    expect(ast.statements[0]).toBeInstanceOf(NodeDeclaration);
    expect(ast.statements[0].name).toBe('x');
    expect(ast.statements[0].value).toBeInstanceOf(Literal);
    expect(ast.statements[0].value.value).toBe(10);
  });

  it('should parse binary expressions', () => {
    const ast = parse('x + 5');
    expect(ast.statements[0]).toBeInstanceOf(BinaryExpression);
    expect(ast.statements[0].operator).toBe('+');
    expect(ast.statements[0].left).toBeInstanceOf(Identifier);
    expect(ast.statements[0].right).toBeInstanceOf(Literal);
  });

  it('should respect operator precedence', () => {
    const ast = parse('2 + 3 * 4');
    const expr = ast.statements[0];
    
    expect(expr).toBeInstanceOf(BinaryExpression);
    expect(expr.operator).toBe('+');
    expect(expr.left.value).toBe(2);
    expect(expr.right).toBeInstanceOf(BinaryExpression);
    expect(expr.right.operator).toBe('*');
  });

  it('should parse action declarations', () => {
    const code = `
      action add(a, b)
        a + b
      end
    `;
    const ast = parse(code);
    
    expect(ast.statements[0]).toBeInstanceOf(ActionDeclaration);
    expect(ast.statements[0].name).toBe('add');
    expect(ast.statements[0].params).toEqual(['a', 'b']);
    expect(ast.statements[0].body.statements.length).toBe(1);
  });

  it('should parse check statements', () => {
    const code = `
      check (x > 5)
        x + 1
      end
    `;
    const ast = parse(code);
    
    expect(ast.statements[0]).toBeInstanceOf(CheckStatement);
    expect(ast.statements[0].condition).toBeInstanceOf(BinaryExpression);
    expect(ast.statements[0].consequent.statements.length).toBe(1);
  });

  it('should parse check statements with else', () => {
    const code = `
      check (x > 5)
        x + 1
      else
        x - 1
      end
    `;
    const ast = parse(code);
    
    expect(ast.statements[0]).toBeInstanceOf(CheckStatement);
    expect(ast.statements[0].alternate).toBeTruthy();
    expect(ast.statements[0].alternate.statements.length).toBe(1);
  });

  it('should parse each statements', () => {
    const code = `
      each (item in items)
        item + 1
      end
    `;
    const ast = parse(code);
    
    expect(ast.statements[0]).toBeInstanceOf(EachStatement);
    expect(ast.statements[0].variable).toBe('item');
    expect(ast.statements[0].iterable).toBeInstanceOf(Identifier);
    expect(ast.statements[0].body.statements.length).toBe(1);
  });

  it('should parse as (while) statements', () => {
    const code = `
      as (x > 0)
        x - 1
      end
    `;
    const ast = parse(code);
    
    expect(ast.statements[0]).toBeInstanceOf(AsStatement);
    expect(ast.statements[0].condition).toBeInstanceOf(BinaryExpression);
    expect(ast.statements[0].body.statements.length).toBe(1);
  });

  it('should parse function calls', () => {
    const ast = parse('print("hello")');
    
    expect(ast.statements[0]).toBeInstanceOf(CallExpression);
    expect(ast.statements[0].callee).toBeInstanceOf(Identifier);
    expect(ast.statements[0].callee.name).toBe('print');
    expect(ast.statements[0].args.length).toBe(1);
  });

  it('should parse array literals', () => {
    const ast = parse('[1, 2, 3]');
    
    expect(ast.statements[0].type).toBe('ArrayExpression');
    expect(ast.statements[0].elements.length).toBe(3);
  });

  it('should parse complex expressions', () => {
    const code = 'result = add(10, 20)';
    const ast = parse(code);
    
    expect(ast.statements[0]).toBeInstanceOf(NodeDeclaration);
    expect(ast.statements[0].value).toBeInstanceOf(CallExpression);
  });
});
