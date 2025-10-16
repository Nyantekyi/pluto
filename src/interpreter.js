import { Environment } from './environment.js';
import { builtins } from './builtins.js';

/**
 * Pluto Interpreter - executes AST
 */
export class Interpreter {
  constructor() {
    this.globalEnv = new Environment();
    this.maxIterations = 10000; // Prevent infinite loops
    
    // Register built-in functions
    for (const [name, fn] of Object.entries(builtins)) {
      this.globalEnv.define(name, fn);
    }
  }

  execute(ast) {
    return this.evaluate(ast, this.globalEnv);
  }

  evaluate(node, env) {
    if (!node) return null;

    switch (node.type) {
      case 'Program':
        return this.evaluateProgram(node, env);
      
      case 'NodeDeclaration':
        return this.evaluateNodeDeclaration(node, env);
      
      case 'ActionDeclaration':
        return this.evaluateActionDeclaration(node, env);
      
      case 'CheckStatement':
        return this.evaluateCheckStatement(node, env);
      
      case 'EachStatement':
        return this.evaluateEachStatement(node, env);
      
      case 'AsStatement':
        return this.evaluateAsStatement(node, env);
      
      case 'BlockStatement':
        return this.evaluateBlockStatement(node, env);
      
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(node, env);
      
      case 'UnaryExpression':
        return this.evaluateUnaryExpression(node, env);
      
      case 'CallExpression':
        return this.evaluateCallExpression(node, env);
      
      case 'MemberExpression':
        return this.evaluateMemberExpression(node, env);
      
      case 'ArrayExpression':
        return this.evaluateArrayExpression(node, env);
      
      case 'Identifier':
        return this.evaluateIdentifier(node, env);
      
      case 'Literal':
        return node.value;
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  evaluateProgram(node, env) {
    let result = null;
    for (const statement of node.statements) {
      result = this.evaluate(statement, env);
    }
    return result;
  }

  evaluateNodeDeclaration(node, env) {
    const value = this.evaluate(node.value, env);
    // Check if variable exists in current environment (not parent)
    if (env.variables.has(node.name)) {
      // Update existing variable in current scope
      env.variables.set(node.name, value);
    } else if (env.parent && env.parent.has(node.name)) {
      // Variable exists in parent scope, update it there
      env.set(node.name, value);
    } else {
      // New variable, define it in current scope
      env.define(node.name, value);
    }
    return value;
  }

  evaluateActionDeclaration(node, env) {
    // Create a function that captures the action's AST
    const action = (...args) => {
      // Create new environment for action execution
      const actionEnv = new Environment(env);
      
      // Bind parameters
      for (let i = 0; i < node.params.length; i++) {
        actionEnv.define(node.params[i], args[i]);
      }
      
      // Track variables assigned in action body (only local ones)
      const assignedVars = new Set();
      const originalDefine = actionEnv.define.bind(actionEnv);
      const originalSet = actionEnv.set.bind(actionEnv);
      
      // Override define to track new variables
      actionEnv.define = (name, value) => {
        // Don't track parameters as assigned vars
        if (!node.params.includes(name)) {
          assignedVars.add(name);
        }
        originalDefine(name, value);
      };
      
      // Override set to create local variables instead of updating parent
      actionEnv.set = (name, value) => {
        // In actions, always create local variables, don't update parent
        if (!node.params.includes(name)) {
          assignedVars.add(name);
        }
        originalDefine(name, value);
      };
      
      // Execute action body and get last value
      let lastValue = null;
      for (const statement of node.body.statements) {
        lastValue = this.evaluate(statement, actionEnv);
      }
      
      // Implement implicit return behavior
      if (assignedVars.size > 1) {
        // Multiple assigned variables - return as object
        const result = {};
        for (const varName of assignedVars) {
          result[varName] = actionEnv.get(varName);
        }
        return result;
      } else if (assignedVars.size === 1) {
        // Single assigned variable - return its value
        const varName = Array.from(assignedVars)[0];
        return actionEnv.get(varName);
      } else {
        // No assignments - return last expression
        return lastValue;
      }
    };
    
    env.define(node.name, action);
    return action;
  }

  evaluateCheckStatement(node, env) {
    const condition = this.evaluate(node.condition, env);
    
    if (this.isTruthy(condition)) {
      return this.evaluate(node.consequent, env);
    } else if (node.alternate) {
      return this.evaluate(node.alternate, env);
    }
    
    return null;
  }

  evaluateEachStatement(node, env) {
    const iterable = this.evaluate(node.iterable, env);
    
    if (!Array.isArray(iterable)) {
      throw new Error('Each statement requires an array');
    }
    
    let result = null;
    for (let i = 0; i < iterable.length && i < this.maxIterations; i++) {
      const loopEnv = new Environment(env);
      loopEnv.define(node.variable, iterable[i]);
      result = this.evaluate(node.body, loopEnv);
    }
    
    return result;
  }

  evaluateAsStatement(node, env) {
    let result = null;
    let iterations = 0;
    
    while (this.isTruthy(this.evaluate(node.condition, env))) {
      if (iterations++ >= this.maxIterations) {
        throw new Error('Maximum iteration limit exceeded in as loop');
      }
      result = this.evaluate(node.body, env);
    }
    
    return result;
  }

  evaluateBlockStatement(node, env) {
    let result = null;
    for (const statement of node.statements) {
      result = this.evaluate(statement, env);
    }
    return result;
  }

  evaluateBinaryExpression(node, env) {
    const left = this.evaluate(node.left, env);
    const right = this.evaluate(node.right, env);
    
    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '%': return left % right;
      case '==': return left === right;
      case '!=': return left !== right;
      case '<': return left < right;
      case '>': return left > right;
      case '<=': return left <= right;
      case '>=': return left >= right;
      case '&&': return this.isTruthy(left) && this.isTruthy(right);
      case '||': return this.isTruthy(left) || this.isTruthy(right);
      default:
        throw new Error(`Unknown binary operator: ${node.operator}`);
    }
  }

  evaluateUnaryExpression(node, env) {
    const argument = this.evaluate(node.argument, env);
    
    switch (node.operator) {
      case '-': return -argument;
      case '!': return !this.isTruthy(argument);
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  evaluateCallExpression(node, env) {
    const fn = this.evaluate(node.callee, env);
    
    if (typeof fn !== 'function') {
      throw new Error(`${node.callee.name} is not a function`);
    }
    
    const args = node.args.map(arg => this.evaluate(arg, env));
    return fn(...args);
  }

  evaluateMemberExpression(node, env) {
    const object = this.evaluate(node.object, env);
    
    if (node.computed) {
      // Array access: obj[index]
      const property = this.evaluate(node.property, env);
      return object[property];
    } else {
      // Dot access: obj.property
      return object[node.property.name];
    }
  }

  evaluateArrayExpression(node, env) {
    return node.elements.map(element => this.evaluate(element, env));
  }

  evaluateIdentifier(node, env) {
    return env.get(node.name);
  }

  isTruthy(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    return true;
  }
}
