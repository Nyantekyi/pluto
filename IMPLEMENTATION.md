# Pluto Interpreter Implementation

This document describes the implementation of the Pluto Core Interpreter (Milestone 1).

## Architecture

The interpreter follows a classic three-stage architecture:

```
Source Code → Lexer → Tokens → Parser → AST → Interpreter → Result
```

### 1. Lexer (Tokenizer)

**File**: `src/lexer.js`

The lexer converts raw source code into a stream of tokens. It recognizes:

- **Keywords**: `check`, `else`, `each`, `as`, `action`, `end`, `in`
- **Literals**: Numbers (42, 3.14), Strings ("hello"), Booleans (true, false)
- **Operators**: `+`, `-`, `*`, `/`, `%`, `=`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `&&`, `||`, `!`
- **Punctuation**: `(`, `)`, `{`, `}`, `[`, `]`, `,`, `.`
- **Comments**: `// single line comments`

**Key Features**:
- Character-by-character scanning
- Escape sequence support in strings
- Line and column tracking for error reporting
- Whitespace and comment filtering

### 2. Parser

**File**: `src/parser.js`

The parser converts tokens into an Abstract Syntax Tree (AST). It implements:

- **Recursive descent parsing**
- **Operator precedence** (from lowest to highest):
  1. Logical OR (`||`)
  2. Logical AND (`&&`)
  3. Equality (`==`, `!=`)
  4. Relational (`<`, `>`, `<=`, `>=`)
  5. Additive (`+`, `-`)
  6. Multiplicative (`*`, `/`, `%`)
  7. Unary (`-`, `!`)
  8. Postfix (function calls, array access, member access)

**AST Node Types**:
- `Program`: Root node containing all statements
- `NodeDeclaration`: Variable assignment (`x = 10`)
- `ActionDeclaration`: Function definition with implicit returns
- `CheckStatement`: If/else conditional
- `EachStatement`: For-each loop
- `AsStatement`: While loop
- `BinaryExpression`: Binary operations (a + b)
- `UnaryExpression`: Unary operations (-x, !condition)
- `CallExpression`: Function calls
- `MemberExpression`: Property/array access
- `ArrayExpression`: Array literals
- `Identifier`: Variable references
- `Literal`: Constant values
- `BlockStatement`: Block of statements

### 3. Interpreter

**Files**: `src/interpreter.js`, `src/environment.js`, `src/builtins.js`

The interpreter evaluates the AST using a tree-walking approach.

#### Environment (Scope Management)

The `Environment` class provides lexical scoping:
- Variables are stored in a chain of environments
- Each scope has a parent reference
- Variable lookup searches up the scope chain
- Supports shadowing (inner scope variables hide outer ones)

#### Built-in Functions

Located in `src/builtins.js`, includes:

**Console**: `print()`, `log()`
**Math**: `abs()`, `sqrt()`, `pow()`, `min()`, `max()`, `random()`, `floor()`, `ceil()`, `round()`
**String**: `length()`, `substring()`, `indexOf()`, `toUpperCase()`, `toLowerCase()`, `split()`, `trim()`, `replace()`
**Array**: `push()`, `pop()`, `slice()`, `map()`, `filter()`, `reduce()`, `join()`, `reverse()`, `sort()`
**Array Utils**: `sum()`, `average()`, `minimum()`, `maximum()`
**Type Conversion**: `toString()`, `toNumber()`, `toBoolean()`
**Type Checking**: `isNumber()`, `isString()`, `isBoolean()`, `isArray()`, `isObject()`

#### Implicit Return Behavior

Actions (functions) automatically return values:

1. **No assignments**: Returns the last expression
   ```javascript
   action square(x)
     x * x
   end
   // Returns: 25 when called with 5
   ```

2. **Single assignment**: Returns the assigned value
   ```javascript
   action double(x)
     result = x * 2
   end
   // Returns: 10 when called with 5
   ```

3. **Multiple assignments**: Returns an object with all assigned variables
   ```javascript
   action calculate(a, b)
     sum = a + b
     diff = a - b
   end
   // Returns: { sum: 15, diff: 5 } when called with (10, 5)
   ```

#### Scoping Rules

1. **Global Scope**: Top-level variables accessible everywhere
2. **Action Scope**: Variables defined in actions are local
3. **Loop Scope**: Variables in loops can access and modify outer scope
4. **Shadowing**: Inner scopes can shadow outer variables

### 4. Main Entry Point

**File**: `src/index.js`

The `PlutoInterpreter` class provides the main API:

```javascript
import { PlutoInterpreter } from 'pluto-interpreter';

const pluto = new PlutoInterpreter();
const result = pluto.execute('x = 10\ny = 20\nx + y');
console.log(result); // 30
```

## Build System

**File**: `build.js`

Uses esbuild to create three builds:

1. **Browser** (`dist/pluto.browser.js`): IIFE format with global `Pluto` variable
2. **Node.js** (`dist/pluto.node.js`): CommonJS format
3. **ES Module** (`dist/pluto.esm.js`): Modern ES module format

## Testing

**Framework**: Vitest

**Test Files**:
- `tests/lexer.test.js`: 10 tests for tokenization
- `tests/parser.test.js`: 15 tests for AST generation
- `tests/interpreter.test.js`: 19 tests for execution

**Coverage**: 44 tests covering:
- Token recognition
- Syntax parsing
- Operator precedence
- Variable scoping
- Function calls
- Control flow
- Built-in functions
- Implicit returns
- Edge cases

## Usage Examples

See `examples/basic.js` for comprehensive examples demonstrating:

1. Basic assignment and arithmetic
2. Actions with implicit returns
3. Actions with multiple return values
4. Check statements (if/else)
5. Each loops (for-each)
6. As loops (while)
7. Built-in functions
8. String operations
9. Complex nested operations

## Performance Considerations

- **Iteration Limits**: Maximum 10,000 iterations per loop to prevent infinite loops
- **No Tail Call Optimization**: Deep recursion may cause stack overflow
- **Immutable Built-ins**: Built-in functions don't modify input (e.g., `push()` returns new array)

## Security

Current implementation has basic security:
- No access to global objects (window, process, etc.)
- Iteration limits prevent infinite loops
- No `eval()` or `Function()` constructor
- Built-in whitelist approach

**Note**: For production use, additional sandboxing is required (see Phase 5 in main README).

## Limitations

Current implementation does not include:
- Object literals
- Destructuring
- Spread operator
- Template literals
- Error recovery (fails on first syntax error)
- Debugging features
- Source maps for runtime errors

These features are planned for future milestones.

## API Reference

### PlutoInterpreter

```javascript
class PlutoInterpreter {
  constructor()
  execute(code: string): any
  getGlobalEnvironment(): Environment
}
```

### Methods

#### `execute(code: string): any`

Executes Pluto source code and returns the result.

**Parameters**:
- `code`: Pluto source code as a string

**Returns**: The result of the last expression

**Throws**: `Error` if syntax or runtime error occurs

**Example**:
```javascript
const pluto = new PlutoInterpreter();
const result = pluto.execute('x = 10\nx + 20'); // Returns 30
```

#### `getGlobalEnvironment(): Environment`

Returns the global environment for inspecting variables.

**Example**:
```javascript
const pluto = new PlutoInterpreter();
pluto.execute('x = 10');
const x = pluto.getGlobalEnvironment().get('x'); // 10
```

## Contributing

When extending the interpreter:

1. Add tests first (TDD approach)
2. Update AST node types if adding new syntax
3. Follow existing code patterns
4. Document new features in README
5. Ensure all tests pass

## License

MIT License
