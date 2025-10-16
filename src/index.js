import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

/**
 * PlutoInterpreter - Main class for executing Pluto code
 */
export class PlutoInterpreter {
  constructor() {
    this.interpreter = new Interpreter();
  }

  /**
   * Execute Pluto code and return the result
   * @param {string} code - Pluto source code
   * @returns {*} - The result of execution
   */
  execute(code) {
    try {
      // Lexical analysis
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      
      // Parsing
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      // Interpretation
      const result = this.interpreter.execute(ast);
      
      return result;
    } catch (error) {
      throw new Error(`Pluto Error: ${error.message}`);
    }
  }

  /**
   * Get the global environment (for accessing variables and functions)
   */
  getGlobalEnvironment() {
    return this.interpreter.globalEnv;
  }
}

// Export individual components for advanced usage
export { Lexer } from './lexer.js';
export { Parser } from './parser.js';
export { Interpreter } from './interpreter.js';
export { Environment } from './environment.js';
export { builtins } from './builtins.js';

// Default export
export default PlutoInterpreter;
