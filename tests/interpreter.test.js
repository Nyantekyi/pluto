import { describe, it, expect, vi } from 'vitest';
import { PlutoInterpreter } from '../src/index.js';

describe('Interpreter', () => {
  it('should execute simple node assignment', () => {
    const pluto = new PlutoInterpreter();
    const result = pluto.execute('x = 10');
    expect(result).toBe(10);
  });

  it('should execute arithmetic expressions', () => {
    const pluto = new PlutoInterpreter();
    pluto.execute('x = 10');
    pluto.execute('y = 20');
    const result = pluto.execute('x + y');
    expect(result).toBe(30);
  });

  it('should execute action with implicit return (single value)', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      action square(x)
        x * x
      end
      result = square(5)
    `;
    const result = pluto.execute(code);
    expect(result).toBe(25);
  });

  it('should execute action with multiple return values as object', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      action calculate(a, b)
        sum = a + b
        diff = a - b
        prod = a * b
      end
      results = calculate(10, 5)
    `;
    const result = pluto.execute(code);
    expect(result).toEqual({ sum: 15, diff: 5, prod: 50 });
  });

  it('should execute check statement', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      x = 10
      check (x > 5)
        result = "greater"
      else
        result = "smaller"
      end
      result
    `;
    const result = pluto.execute(code);
    expect(result).toBe('greater');
  });

  it('should execute each loop', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      items = [1, 2, 3]
      sum = 0
      each (item in items)
        sum = sum + item
      end
      sum
    `;
    const result = pluto.execute(code);
    expect(result).toBe(6);
  });

  it('should execute as (while) loop', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      x = 5
      as (x > 0)
        x = x - 1
      end
      x
    `;
    const result = pluto.execute(code);
    expect(result).toBe(0);
  });

  it('should call built-in functions', () => {
    const pluto = new PlutoInterpreter();
    const result = pluto.execute('abs(-5)');
    expect(result).toBe(5);
  });

  it('should handle print function', () => {
    const pluto = new PlutoInterpreter();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    pluto.execute('print("hello")');
    
    expect(spy).toHaveBeenCalledWith('hello');
    spy.mockRestore();
  });

  it('should handle array operations', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      arr = [1, 2, 3]
      result = length(arr)
    `;
    const result = pluto.execute(code);
    expect(result).toBe(3);
  });

  it('should handle string operations', () => {
    const pluto = new PlutoInterpreter();
    const result = pluto.execute('toUpperCase("hello")');
    expect(result).toBe('HELLO');
  });

  it('should handle comparison operators', () => {
    const pluto = new PlutoInterpreter();
    expect(pluto.execute('5 > 3')).toBe(true);
    expect(pluto.execute('5 < 3')).toBe(false);
    expect(pluto.execute('5 == 5')).toBe(true);
    expect(pluto.execute('5 != 3')).toBe(true);
  });

  it('should handle logical operators', () => {
    const pluto = new PlutoInterpreter();
    expect(pluto.execute('true && true')).toBe(true);
    expect(pluto.execute('true && false')).toBe(false);
    expect(pluto.execute('true || false')).toBe(true);
    expect(pluto.execute('false || false')).toBe(false);
  });

  it('should handle array access', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      arr = [10, 20, 30]
      arr[1]
    `;
    const result = pluto.execute(code);
    expect(result).toBe(20);
  });

  it('should handle nested function calls', () => {
    const pluto = new PlutoInterpreter();
    const result = pluto.execute('abs(-abs(5))');
    expect(result).toBe(5);
  });

  it('should handle complex example from README', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      action splitName(fullName)
        parts = split(fullName, " ")
        first = parts[0]
        last = parts[1]
      end
      
      result = splitName("John Doe")
    `;
    const result = pluto.execute(code);
    expect(result).toEqual({ parts: ['John', 'Doe'], first: 'John', last: 'Doe' });
  });

  it('should handle action with single assigned variable', () => {
    const pluto = new PlutoInterpreter();
    const code = `
      action double(x)
        result = x * 2
      end
      
      value = double(5)
    `;
    const result = pluto.execute(code);
    expect(result).toBe(10);
  });

  it('should respect operator precedence', () => {
    const pluto = new PlutoInterpreter();
    expect(pluto.execute('2 + 3 * 4')).toBe(14);
    expect(pluto.execute('(2 + 3) * 4')).toBe(20);
  });

  it('should handle modulo operator', () => {
    const pluto = new PlutoInterpreter();
    expect(pluto.execute('10 % 3')).toBe(1);
  });
});
