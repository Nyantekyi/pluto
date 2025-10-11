# Pluto - Visual Workflow Builder

A simple, browser-compatible visual programming tool for creating custom executables within Nuxt 4 applications with drag-and-drop functionality.

## 🎯 Project Overview

Pluto is designed to be a lightweight, user-friendly visual programming tool that enables users to create and execute custom workflows within a Nuxt 4 application. **No programming knowledge required!** Users simply drag and drop predetermined blocks (actions, nodes, checks, and each) onto a canvas, configure them with simple inputs, and execute their workflow.

### 🧩 Simplified Terminology

To make Pluto accessible to everyone, we use simplified terminology:

| What It Does | We Call It | Programming Term |
|-------------|-----------|------------------|
| Store a value | **Node** | Variable/Constant |
| Perform an operation | **Action** | Function |
| Make a decision | **Check** | If/Conditional |
| Repeat for items | **Each** | For Loop |

**Example**: To print "something" to the console:
1. Drag the **Print action** block to the canvas
2. Type "something" in the input field
3. Click Execute

That's it! No code writing needed.

### 🔄 Return Value Behavior

Pluto simplifies return values - you never need to write `return` statements!

**Actions automatically return values:**
- **Single value**: The last line is automatically returned
- **Multiple values**: All variables you create are automatically returned together

**Example:**
```javascript
// This action automatically returns the result
action double(x) => [
  x * 2;
]

// This action automatically returns an object with both values
action splitName(fullName) => [
  first = fullName.split(" ")[0];
  last = fullName.split(" ")[1];
]

result = splitName("John Doe");
// result = { first: "John", last: "Doe" }
```

## 📋 Development Plan

### Phase 1: Core Interpreter Design

#### 1.1 Define the Block System
- **Simple Operations**: Support basic operations (arithmetic, logical, string manipulation)
- **Nodes (Data Storage)**: Direct assignment for storing values (interpreter handles `var` internally)
- **Checks (Conditions)**: `check` blocks for decision-making
- **Each (Loops)**: `each` blocks for iterating over items
- **Actions**: Pre-defined action blocks for common operations
- **Built-in Actions**: Pre-configured utility actions

**Example Workflow:**
```javascript
// Simple node (variable) assignment
x = 10;
y = x + 5;

// Check (conditional) - implicitly returns boolean
check(x > 5) => print("x is greater than 5")

// Action (function) - last expression is automatically returned
action add(a, b) => [
  a + b;
]

result = add(10, 20);

// Action with multiple values - use simplified variable names
action calculate(a, b) => [
  sum = a + b;
  diff = a - b;
  prod = a * b;
]

// Returns object with sum, diff, and prod properties
results = calculate(10, 5);
```

#### 1.2 Lexer (Tokenizer)
- **Purpose**: Convert raw source code into tokens
- **Implementation**: 
  - Scan input character by character
  - Identify keywords, identifiers, operators, literals, and symbols
  - Create token objects with type and value
- **Token Types**: 
  - Keywords (check, else, each, action)
  - Identifiers (node/action names)
  - Literals (numbers, strings, booleans)
  - Operators (+, -, *, /, =, ==, !=, <, >, &&, ||, =>)
  - Punctuation (;, {, }, (, ), ,, [, ])

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
  - NodeDeclaration (variable storage)
  - ActionDeclaration (function-like blocks with implicit return)
  - ExpressionStatement
  - BinaryExpression
  - CallExpression
  - CheckStatement (conditional with implicit boolean return)
  - EachStatement (loop)
  - BlockStatement

**File**: `src/parser.js`

#### 1.4 Interpreter (Evaluator)
- **Purpose**: Execute the AST and produce results
- **Implementation**:
  - Tree-walking interpreter
  - Maintain execution context (scope/environment)
  - Evaluate expressions and execute statements
  - Handle node scoping (lexical scoping)
  - Implement call stack for action calls
  - Implicit return: last expression in action is automatically returned
  - Multiple return values: collect all assigned variables in action body
- **Features**:
  - Environment/Scope management
  - Built-in action library
  - Error handling and reporting
  - Execution limits (prevent infinite loops)
  - Automatic return value handling for actions and checks

**File**: `src/interpreter.js`

#### 1.5 Return Value Behavior

**Actions** and **Checks** automatically return values without explicit `return` statements:

##### Single Value Return (Implicit)
```javascript
// The last expression is automatically returned
action square(x) => [
  x * x;
]

result = square(5);  // result = 25
```

##### Multiple Value Return
When multiple variables are assigned within an action, they are automatically collected and returned as an object:

```javascript
action calculate(a, b) => [
  sum = a + b;
  diff = a - b;
  prod = a * b;
]

results = calculate(10, 5);
// results = { sum: 15, diff: 5, prod: 50 }
```

Variable names are used as-is from the action body. Use simplified, descriptive names:
```javascript
action stats(numbers) => [
  total = sum(numbers);
  avg = total / length(numbers);
  max = maximum(numbers);
  min = minimum(numbers);
]

data = stats([1, 2, 3, 4, 5]);
// data = { total: 15, avg: 3, max: 5, min: 1 }
```

##### Check Return Values
Checks automatically return boolean values:
```javascript
action isPositive(x) => [
  check(x > 0) => true
  else => false
]

// Simplified - the check itself returns the boolean
action isEven(x) => [
  x % 2 == 0;
]

result = isEven(4);  // result = true
```

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
- **Visual Programming Blocks**: Represent predetermined actions as draggable blocks (no coding required)
- **Block Categories**:
  - Nodes (store, assign, get values)
  - Operations (math, logic, string)
  - Checks (decision-making)
  - Each (iterate over items)
  - Actions (pre-defined operations)
  - Output (print, alert)
  
#### 4.2 Block-to-Code Compiler
- **Purpose**: Convert visual blocks to interpreter-compatible code (happens automatically)
- **Implementation**:
  - Each block type maps to a predetermined template
  - Nested blocks create nested structures
  - Serialize block tree to executable code

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
// Block definition example (predetermined for users)
// Users never see these templates - they just drag blocks and fill in inputs
const blocks = {
  node_declare: {
    type: 'statement',
    template: '{name} = {value};',
    inputs: ['name', 'value'],
    color: '#4CAF50',
    label: 'Store Value in Node'
  },
  math_operation: {
    type: 'expression',
    template: '{left} {operator} {right}',
    inputs: ['left', 'operator', 'right'],
    color: '#2196F3',
    label: 'Calculate'
  },
  check_condition: {
    type: 'statement',
    template: 'check({condition}) => {body}',
    inputs: ['condition', 'body'],
    color: '#FF9800',
    label: 'Check If'
  },
  each_loop: {
    type: 'statement',
    template: 'each({item} in {list}) => [{body}]',
    inputs: ['item', 'list', 'body'],
    color: '#9C27B0',
    label: 'Each Item'
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

### Phase 6: Built-in Actions & Libraries

#### 6.1 Standard Action Library
- **Math Actions**: `abs()`, `sqrt()`, `pow()`, `min()`, `max()`, `random()`
- **String Actions**: `length()`, `substring()`, `indexOf()`, `toUpperCase()`, `toLowerCase()`
- **Array Actions**: `push()`, `pop()`, `slice()`, `map()`, `filter()`, `reduce()`
- **Console Actions**: `print()`, `log()`, `clear()`
- **Type Conversion**: `toString()`, `toNumber()`, `toBoolean()`

#### 6.2 Nuxt-Specific Actions
- **Data Fetching**: `fetch()`, `useFetch()`
- **State Management**: `useState()`, `setGlobalState()`
- **Navigation**: `navigateTo()`, `back()`
- **UI Interaction**: `showModal()`, `showToast()`, `confirm()`

**File**: `src/stdlib.js`

**Example Built-in Action Implementations:**
```javascript
// Single return value
action abs(x) => [
  check(x < 0) => -x
  else => x
]

// Multiple return values
action minMax(arr) => [
  min = minimum(arr);
  max = maximum(arr);
  range = max - min;
]

// Usage
limits = minMax([1, 5, 3, 9, 2]);
// limits = { min: 1, max: 9, range: 8 }
```

### Phase 7: Development Tools

#### 7.1 Debug Support
- Step-through execution
- Breakpoints
- Variable inspection
- Call stack visualization

#### 7.2 Error Handling
- Block configuration error reporting
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
- Block reference guide
- Visual builder tutorial
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
- [ ] Implement lexer with token recognition (no `return` keyword needed)
- [ ] Build parser with AST generation
- [ ] Create interpreter with basic evaluation
- [ ] Add support for nodes (data storage), operators, and basic expressions
- [ ] Implement implicit return for actions (last expression returned)
- [ ] Implement multiple return values as objects for actions
- [ ] Write unit tests for each component

### Milestone 2: Block Features (Weeks 4-5)
- [ ] Add checks (decision-making blocks with implicit boolean return)
- [ ] Add each loops (iteration blocks)
- [ ] Implement actions (pre-defined operation blocks with implicit returns)
- [ ] Add built-in action library
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
  x = 10;
  y = 20;
  sum = x + y;
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
  greeting = "Hello from Pluto!";
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

A simple "Hello World" workflow using drag-and-drop blocks:
```
┌─────────────────────────────────┐
│ Start Program                   │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│ Store Value in Node             │
│ name: message                   │
│ value: "Hello, World!"          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│ Print (Action)                  │
│ value: message                  │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│ End Program                     │
└─────────────────────────────────┘
```

User simply drags and drops blocks, fills in "message" and "Hello, World!", then executes.

This generates:
```javascript
message = "Hello, World!";
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
