# Pluto - Lightweight Language Interpreter

A simple, browser-compatible JavaScript interpreter for creating custom executables within Nuxt 4 applications with drag-and-drop functionality.

## 🎯 Project Overview

Pluto is designed to be a lightweight, user-friendly language interpreter that enables users to create and execute custom scripts within a Nuxt 4 JavaScript application. The interpreter prioritizes simplicity and ease of use, with a visual drag-and-drop interface for building custom executables.

## 📋 Development Plan

### Phase 1: Core Interpreter Design

#### 1.1 Define the Language Syntax
- **Simple Expression Language**: Support basic operations (arithmetic, logical, string manipulation)
- **Variable Declaration and Assignment**: `let`, `const` keywords
- **Control Flow**: `if/else`, `while`, `for` statements
- **Functions**: Simple function declarations and calls
- **Built-in Functions**: Pre-defined utility functions for common operations
- **Comments**: Single-line (`//`) and multi-line (`/* */`) comments

**Example Syntax:**
```javascript
// Simple variable assignment
let x = 10;
let y = x + 5;

// Control flow
if (x > 5) {
  print("x is greater than 5");
}

// Functions
function add(a, b) {
  return a + b;
}

let result = add(10, 20);
```

#### 1.2 Lexer (Tokenizer)
- **Purpose**: Convert raw source code into tokens
- **Implementation**: 
  - Scan input character by character
  - Identify keywords, identifiers, operators, literals, and symbols
  - Create token objects with type and value
- **Token Types**: 
  - Keywords (let, const, if, else, while, for, function, return)
  - Identifiers (variable/function names)
  - Literals (numbers, strings, booleans)
  - Operators (+, -, *, /, =, ==, !=, <, >, &&, ||)
  - Punctuation (;, {, }, (, ), ,)

**File**: `src/lexer.js`

#### 1.3 Parser
- **Purpose**: Convert tokens into an Abstract Syntax Tree (AST)
- **Implementation**:
  - Recursive descent parser
  - Create AST nodes for different statement types
  - Handle operator precedence
  - Validate syntax
- **AST Node Types**:
  - Program (root node)
  - VariableDeclaration
  - FunctionDeclaration
  - ExpressionStatement
  - BinaryExpression
  - CallExpression
  - IfStatement
  - WhileStatement
  - BlockStatement

**File**: `src/parser.js`

#### 1.4 Interpreter (Evaluator)
- **Purpose**: Execute the AST and produce results
- **Implementation**:
  - Tree-walking interpreter
  - Maintain execution context (scope/environment)
  - Evaluate expressions and execute statements
  - Handle variable scoping (lexical scoping)
  - Implement call stack for function calls
- **Features**:
  - Environment/Scope management
  - Built-in function library
  - Error handling and reporting
  - Execution limits (prevent infinite loops)

**File**: `src/interpreter.js`

### Phase 2: Browser & Node.js Compatibility

#### 2.1 Module Structure
- **ES Modules**: Use modern JavaScript module syntax
- **No External Dependencies**: Keep the interpreter self-contained
- **Bundle Configuration**: Create both browser and Node.js compatible builds

**Structure:**
```
pluto/
├── src/
│   ├── lexer.js
│   ├── parser.js
│   ├── interpreter.js
│   ├── environment.js
│   ├── builtins.js
│   └── index.js (main entry point)
├── dist/
│   ├── pluto.browser.js (browser build)
│   ├── pluto.node.js (Node.js build)
│   └── pluto.esm.js (ES module)
└── package.json
```

#### 2.2 Browser Compatibility
- Use standard JavaScript (ES6+)
- No Node.js-specific APIs
- Provide Web Worker support for heavy computation
- Include error handling for browser environment

#### 2.3 Node.js Compatibility
- Export as CommonJS and ES modules
- Support Node.js 16+ runtime
- Optional: Add CLI interface for testing

### Phase 3: Nuxt 4 Integration

#### 3.1 Nuxt Plugin
- **Purpose**: Register Pluto as a Nuxt plugin
- **Implementation**:
  - Create `plugins/pluto.js` in Nuxt app
  - Make interpreter available globally via `$pluto`
  - Provide composables for reactive execution

**File**: `nuxt-plugin/pluto.js`

```javascript
export default defineNuxtPlugin(() => {
  return {
    provide: {
      pluto: new PlutoInterpreter()
    }
  }
})
```

#### 3.2 Composables
- `usePluto()`: Access interpreter instance
- `useScript()`: Execute and manage scripts
- `useScriptState()`: Reactive script execution state

**File**: `nuxt-plugin/composables.js`

#### 3.3 Components
- `<PlutoEditor>`: Code editor component
- `<PlutoConsole>`: Output display component
- `<PlutoExecutor>`: Execution control component

### Phase 4: Drag-and-Drop Visual Builder

#### 4.1 Block-Based Interface
- **Visual Programming Blocks**: Represent code constructs as draggable blocks
- **Block Categories**:
  - Variables (declare, assign, get)
  - Operations (math, logic, string)
  - Control Flow (if/else, loops)
  - Functions (define, call)
  - Output (print, alert)
  
#### 4.2 Block-to-Code Compiler
- **Purpose**: Convert visual blocks to interpreter-compatible code
- **Implementation**:
  - Each block type maps to a code template
  - Nested blocks create nested code structures
  - Serialize block tree to source code string

**File**: `src/visual/block-compiler.js`

#### 4.3 Drag-and-Drop UI Components
- **Vue 3 Components**:
  - `<BlockPalette>`: Available blocks library
  - `<BlockWorkspace>`: Drag-and-drop canvas
  - `<BlockConnector>`: Visual connection between blocks
  - `<ExecutionPanel>`: Run, pause, step controls

**Technologies**:
- Vue 3 Composition API
- Native HTML5 Drag and Drop API or library like `@vueuse/core`
- Tailwind CSS for styling

**Files**:
```
components/
├── visual/
│   ├── BlockPalette.vue
│   ├── BlockWorkspace.vue
│   ├── Block.vue
│   ├── BlockConnector.vue
│   └── ExecutionPanel.vue
```

#### 4.4 Block Definition System
```javascript
// Block definition example
const blocks = {
  variable_declare: {
    type: 'statement',
    template: 'let {name} = {value};',
    inputs: ['name', 'value'],
    color: '#4CAF50'
  },
  math_operation: {
    type: 'expression',
    template: '{left} {operator} {right}',
    inputs: ['left', 'operator', 'right'],
    color: '#2196F3'
  },
  // ... more block definitions
}
```

### Phase 5: Security & Sandboxing

#### 5.1 Execution Sandbox
- **Purpose**: Prevent malicious code execution
- **Implementation**:
  - Whitelist allowed operations
  - Restrict access to global objects (window, document, etc.)
  - Time limits for execution
  - Memory limits for variables
  - No eval() or Function() constructor access

#### 5.2 Safe Context
- Create isolated execution environment
- Provide controlled API surface
- Log all operations for audit

**File**: `src/sandbox.js`

### Phase 6: Built-in Functions & Libraries

#### 6.1 Standard Library
- **Math**: `abs()`, `sqrt()`, `pow()`, `min()`, `max()`, `random()`
- **String**: `length()`, `substring()`, `indexOf()`, `toUpperCase()`, `toLowerCase()`
- **Array**: `push()`, `pop()`, `slice()`, `map()`, `filter()`, `reduce()`
- **Console**: `print()`, `log()`, `clear()`
- **Type Conversion**: `toString()`, `toNumber()`, `toBoolean()`

#### 6.2 Nuxt-Specific Functions
- **Data Fetching**: `fetch()`, `useFetch()`
- **State Management**: `useState()`, `setGlobalState()`
- **Navigation**: `navigateTo()`, `back()`
- **UI Interaction**: `showModal()`, `showToast()`, `confirm()`

**File**: `src/stdlib.js`

### Phase 7: Development Tools

#### 7.1 Debug Support
- Step-through execution
- Breakpoints
- Variable inspection
- Call stack visualization

#### 7.2 Error Handling
- Syntax error reporting with line numbers
- Runtime error messages
- Helpful error suggestions

#### 7.3 Performance Monitoring
- Execution time tracking
- Memory usage tracking
- Operation count limits

### Phase 8: Testing & Documentation

#### 8.1 Unit Tests
- Lexer tests (tokenization)
- Parser tests (AST generation)
- Interpreter tests (execution)
- Integration tests (end-to-end)

**Framework**: Vitest or Jest

#### 8.2 Documentation
- API reference
- Language syntax guide
- Block builder tutorial
- Integration examples
- Best practices

#### 8.3 Example Projects
- Calculator app
- Todo list manager
- Simple game logic
- Form validator

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────┐
│         Nuxt 4 Application              │
│  ┌───────────────────────────────────┐  │
│  │   Drag-and-Drop Interface         │  │
│  │   (Vue Components)                │  │
│  └──────────────┬────────────────────┘  │
│                 │                        │
│                 ▼                        │
│  ┌───────────────────────────────────┐  │
│  │   Block-to-Code Compiler          │  │
│  └──────────────┬────────────────────┘  │
│                 │                        │
│                 ▼                        │
│  ┌───────────────────────────────────┐  │
│  │   Pluto Interpreter Core          │  │
│  │  ┌─────────┐  ┌─────────┐        │  │
│  │  │ Lexer   │→ │ Parser  │        │  │
│  │  └─────────┘  └────┬────┘        │  │
│  │                    │              │  │
│  │                    ▼              │  │
│  │  ┌──────────────────────────┐    │  │
│  │  │   AST Interpreter        │    │  │
│  │  └────────┬─────────────────┘    │  │
│  │           │                       │  │
│  │           ▼                       │  │
│  │  ┌──────────────────────────┐    │  │
│  │  │   Execution Sandbox      │    │  │
│  │  └────────┬─────────────────┘    │  │
│  │           │                       │  │
│  └───────────┼───────────────────────┘  │
│              │                           │
│              ▼                           │
│  ┌───────────────────────────────────┐  │
│  │   Output / Side Effects           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 🚀 Implementation Roadmap

### Milestone 1: Core Interpreter (Weeks 1-3)
- [ ] Implement lexer with token recognition
- [ ] Build parser with AST generation
- [ ] Create interpreter with basic evaluation
- [ ] Add support for variables, operators, and basic expressions
- [ ] Write unit tests for each component

### Milestone 2: Language Features (Weeks 4-5)
- [ ] Add control flow (if/else, loops)
- [ ] Implement functions (declaration, calls, returns)
- [ ] Add built-in standard library functions
- [ ] Implement proper scoping and environments
- [ ] Add comprehensive error handling

### Milestone 3: Browser/Node.js Compatibility (Week 6)
- [ ] Set up build system (Rollup/esbuild)
- [ ] Create browser and Node.js builds
- [ ] Test in both environments
- [ ] Package as npm module

### Milestone 4: Nuxt Integration (Week 7)
- [ ] Create Nuxt plugin
- [ ] Build composables for Vue integration
- [ ] Create basic UI components
- [ ] Add examples in Nuxt app

### Milestone 5: Visual Builder (Weeks 8-10)
- [ ] Design block system architecture
- [ ] Implement block-to-code compiler
- [ ] Build drag-and-drop components
- [ ] Create block palette and workspace
- [ ] Add execution controls

### Milestone 6: Polish & Documentation (Weeks 11-12)
- [ ] Implement security sandbox
- [ ] Add debugging tools
- [ ] Write comprehensive documentation
- [ ] Create example projects
- [ ] Performance optimization

## 📦 Project Dependencies

### Core (Zero Dependencies for Interpreter)
- Pure JavaScript implementation
- No runtime dependencies

### Development
- `vite` or `rollup`: Build tool
- `vitest` or `jest`: Testing framework
- `typescript` (optional): Type definitions

### Nuxt Integration
- `nuxt`: ^4.0.0
- `vue`: ^3.0.0
- `@vueuse/core`: Utilities for drag-and-drop

### UI/Visual Builder
- `@vue/compiler-sfc`: Vue component compilation
- Tailwind CSS or similar: Styling

## 🔒 Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **Execution Limits**: Timeout and memory constraints
3. **Scope Isolation**: No access to dangerous globals
4. **API Whitelisting**: Only expose safe functions
5. **CSP Headers**: Content Security Policy for browser
6. **Audit Logging**: Track all script executions

## 📖 Example Usage

### Basic JavaScript API
```javascript
import { PlutoInterpreter } from 'pluto';

const pluto = new PlutoInterpreter();

const code = `
  let x = 10;
  let y = 20;
  let sum = x + y;
  print("The sum is: " + sum);
`;

const result = pluto.execute(code);
console.log(result); // Output: "The sum is: 30"
```

### Nuxt 4 Integration
```vue
<script setup>
const { $pluto } = useNuxtApp();

const code = ref(`
  let greeting = "Hello from Pluto!";
  print(greeting);
`);

const output = ref('');

function runCode() {
  try {
    output.value = $pluto.execute(code.value);
  } catch (error) {
    output.value = `Error: ${error.message}`;
  }
}
</script>

<template>
  <div>
    <textarea v-model="code" />
    <button @click="runCode">Run</button>
    <pre>{{ output }}</pre>
  </div>
</template>
```

### Visual Builder Usage
```vue
<script setup>
import { BlockWorkspace, BlockPalette, ExecutionPanel } from 'pluto/visual';

const workspace = ref(null);

function executeBlocks() {
  const code = workspace.value.generateCode();
  const result = $pluto.execute(code);
  console.log(result);
}
</script>

<template>
  <div class="builder-container">
    <BlockPalette />
    <BlockWorkspace ref="workspace" />
    <ExecutionPanel @execute="executeBlocks" />
  </div>
</template>
```

## 🎨 Visual Block Example

A simple "Hello World" program in block form:
```
┌─────────────────────────────────┐
│ Start Program                   │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│ Declare Variable                │
│ name: message                   │
│ value: "Hello, World!"          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│ Print                           │
│ value: message                  │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│ End Program                     │
└─────────────────────────────────┘
```

This generates:
```javascript
let message = "Hello, World!";
print(message);
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Create descriptive commit messages

## 📄 License

MIT License - Feel free to use in your projects

## 🔗 Resources

- [Writing an Interpreter in JavaScript](https://interpreterbook.com/)
- [Crafting Interpreters](https://craftinginterpreters.com/)
- [Abstract Syntax Trees](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
