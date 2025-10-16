/**
 * Environment class for managing variable scopes
 */
export class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.variables = new Map();
  }

  /**
   * Define a new variable in this environment
   */
  define(name, value) {
    this.variables.set(name, value);
  }

  /**
   * Get a variable value, searching parent scopes if necessary
   */
  get(name) {
    if (this.variables.has(name)) {
      return this.variables.get(name);
    }
    
    if (this.parent) {
      return this.parent.get(name);
    }
    
    throw new Error(`Undefined variable: ${name}`);
  }

  /**
   * Set a variable value, searching parent scopes if necessary
   */
  set(name, value) {
    if (this.variables.has(name)) {
      this.variables.set(name, value);
      return;
    }
    
    if (this.parent) {
      this.parent.set(name, value);
      return;
    }
    
    throw new Error(`Undefined variable: ${name}`);
  }

  /**
   * Check if a variable exists in this environment or parent scopes
   */
  has(name) {
    if (this.variables.has(name)) {
      return true;
    }
    
    if (this.parent) {
      return this.parent.has(name);
    }
    
    return false;
  }

  /**
   * Get all variables defined in this environment (not including parent scopes)
   */
  getLocal() {
    return Object.fromEntries(this.variables);
  }
}
