import { describe, it, expect } from 'vitest';
import { Lexer, TokenType } from '../src/lexer.js';

describe('Lexer', () => {
  it('should tokenize numbers', () => {
    const lexer = new Lexer('42 3.14');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.NUMBER);
    expect(tokens[0].value).toBe(42);
    expect(tokens[1].type).toBe(TokenType.NUMBER);
    expect(tokens[1].value).toBe(3.14);
  });

  it('should tokenize strings', () => {
    const lexer = new Lexer('"hello" \'world\'');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].value).toBe('hello');
    expect(tokens[1].type).toBe(TokenType.STRING);
    expect(tokens[1].value).toBe('world');
  });

  it('should tokenize identifiers', () => {
    const lexer = new Lexer('x name_123');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe('x');
    expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[1].value).toBe('name_123');
  });

  it('should tokenize keywords', () => {
    const lexer = new Lexer('check else each as action end in');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.CHECK);
    expect(tokens[1].type).toBe(TokenType.ELSE);
    expect(tokens[2].type).toBe(TokenType.EACH);
    expect(tokens[3].type).toBe(TokenType.AS);
    expect(tokens[4].type).toBe(TokenType.ACTION);
    expect(tokens[5].type).toBe(TokenType.END);
    expect(tokens[6].type).toBe(TokenType.IN);
  });

  it('should tokenize booleans', () => {
    const lexer = new Lexer('true false');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.BOOLEAN);
    expect(tokens[0].value).toBe(true);
    expect(tokens[1].type).toBe(TokenType.BOOLEAN);
    expect(tokens[1].value).toBe(false);
  });

  it('should tokenize operators', () => {
    const lexer = new Lexer('+ - * / % = == != < > <= >= && ||');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.PLUS);
    expect(tokens[1].type).toBe(TokenType.MINUS);
    expect(tokens[2].type).toBe(TokenType.MULTIPLY);
    expect(tokens[3].type).toBe(TokenType.DIVIDE);
    expect(tokens[4].type).toBe(TokenType.MODULO);
    expect(tokens[5].type).toBe(TokenType.ASSIGN);
    expect(tokens[6].type).toBe(TokenType.EQUAL);
    expect(tokens[7].type).toBe(TokenType.NOT_EQUAL);
    expect(tokens[8].type).toBe(TokenType.LESS_THAN);
    expect(tokens[9].type).toBe(TokenType.GREATER_THAN);
    expect(tokens[10].type).toBe(TokenType.LESS_EQUAL);
    expect(tokens[11].type).toBe(TokenType.GREATER_EQUAL);
    expect(tokens[12].type).toBe(TokenType.AND);
    expect(tokens[13].type).toBe(TokenType.OR);
  });

  it('should tokenize punctuation', () => {
    const lexer = new Lexer('( ) { } [ ] , .');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.LPAREN);
    expect(tokens[1].type).toBe(TokenType.RPAREN);
    expect(tokens[2].type).toBe(TokenType.LBRACE);
    expect(tokens[3].type).toBe(TokenType.RBRACE);
    expect(tokens[4].type).toBe(TokenType.LBRACKET);
    expect(tokens[5].type).toBe(TokenType.RBRACKET);
    expect(tokens[6].type).toBe(TokenType.COMMA);
    expect(tokens[7].type).toBe(TokenType.DOT);
  });

  it('should handle assignment expression', () => {
    const lexer = new Lexer('x = 10');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe('x');
    expect(tokens[1].type).toBe(TokenType.ASSIGN);
    expect(tokens[2].type).toBe(TokenType.NUMBER);
    expect(tokens[2].value).toBe(10);
  });

  it('should skip comments', () => {
    const lexer = new Lexer('x = 10 // this is a comment\ny = 20');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe('x');
    expect(tokens[3].type).toBe(TokenType.NEWLINE);
    expect(tokens[4].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[4].value).toBe('y');
  });

  it('should handle escape sequences in strings', () => {
    const lexer = new Lexer('"hello\\nworld"');
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].value).toBe('hello\nworld');
  });
});
