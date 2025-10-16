# Getting Started with Pluto

Welcome to Pluto! This guide will help you get started with the Pluto visual programming language interpreter.

## Installation

### From Source

```bash
git clone https://github.com/Nyantekyi/pluto.git
cd pluto
npm install
npm run build
```

### Running Tests

```bash
npm test
```

## Quick Start

### Using as a Library

```javascript
import { PlutoInterpreter } from 'pluto-interpreter';

const pluto = new PlutoInterpreter();

// Execute Pluto code
const result = pluto.execute(`
  x = 10
  y = 20
  x + y
`);

console.log(result); // 30
```

### Using the CLI

Run a Pluto script file:
```bash
node cli.js examples/hello.pluto
```

Execute code directly:
```bash
node cli.js -e "print('Hello, World!')"
```

## Language Basics

### Variables (Nodes)

Store values in variables:

```javascript
x = 10
name = "Alice"
items = [1, 2, 3]
isActive = true
```

### Arithmetic

Perform calculations:

```javascript
result = 10 + 20       // 30
difference = 50 - 15   // 35
product = 5 * 6        // 30
quotient = 20 / 4      // 5
remainder = 17 % 5     // 2
```

### Actions (Functions)

Define reusable blocks of code:

```javascript
// Action with implicit return
action square(x)
  x * x
end

result = square(5)  // 25
```

Actions with multiple values automatically return an object:

```javascript
action calculate(a, b)
  sum = a + b
  difference = a - b
  product = a * b
end

result = calculate(10, 5)
// Returns: { sum: 15, difference: 5, product: 50 }
```

### Check Statements (Conditionals)

Make decisions:

```javascript
x = 10

check (x > 5)
  print("x is greater than 5")
else
  print("x is 5 or less")
end
```

### Each Loops (For-Each)

Iterate over arrays:

```javascript
items = [1, 2, 3, 4, 5]
total = 0

each (item in items)
  total = total + item
end

print("Total:", total)  // Total: 15
```

### As Loops (While)

Repeat while a condition is true:

```javascript
count = 5

as (count > 0)
  print(count)
  count = count - 1
end
```

### Arrays

Create and manipulate arrays:

```javascript
// Array literal
numbers = [1, 2, 3, 4, 5]

// Access elements
first = numbers[0]      // 1
second = numbers[1]     // 2

// Get length
size = length(numbers)  // 5
```

### Comments

Add comments to document your code:

```javascript
// This is a single-line comment
x = 10  // Comments can go at the end of lines
```

## Built-in Functions

### Console Output

```javascript
print("Hello, World!")
print("Value:", 42)
log("Debugging info")
```

### Math Functions

```javascript
abs(-5)           // 5
sqrt(16)          // 4
pow(2, 3)         // 8
min(1, 2, 3)      // 1
max(1, 2, 3)      // 3
random()          // Random number between 0 and 1
floor(3.7)        // 3
ceil(3.2)         // 4
round(3.5)        // 4
```

### String Functions

```javascript
text = "Hello, World!"

length(text)              // 13
toUpperCase(text)         // "HELLO, WORLD!"
toLowerCase(text)         // "hello, world!"
substring(text, 0, 5)     // "Hello"
indexOf(text, "World")    // 7
split(text, ", ")         // ["Hello", "World!"]
```

### Array Functions

```javascript
numbers = [1, 2, 3, 4, 5]

sum(numbers)              // 15
average(numbers)          // 3
minimum(numbers)          // 1
maximum(numbers)          // 5
reverse(numbers)          // [5, 4, 3, 2, 1]
sort(numbers)             // [1, 2, 3, 4, 5]
```

### Type Conversion

```javascript
toString(42)              // "42"
toNumber("42")            // 42
toBoolean(1)              // true
```

### Type Checking

```javascript
isNumber(42)              // true
isString("hello")         // true
isBoolean(true)           // true
isArray([1, 2, 3])        // true
```

## Examples

### Example 1: Calculate Factorial

```javascript
action factorial(n)
  check (n <= 1)
    1
  else
    n * factorial(n - 1)
  end
end

result = factorial(5)
print("5! =", result)  // 5! = 120
```

### Example 2: Find Prime Numbers

```javascript
action isPrime(n)
  check (n <= 1)
    false
  end
  
  i = 2
  as (i * i <= n)
    check (n % i == 0)
      false
    end
    i = i + 1
  end
  
  true
end

numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10]
each (num in numbers)
  check (isPrime(num))
    print(num, "is prime")
  end
end
```

### Example 3: Process Array Data

```javascript
action processScores(scores)
  total = sum(scores)
  avg = average(scores)
  highest = maximum(scores)
  lowest = minimum(scores)
end

scores = [85, 92, 78, 90, 88]
result = processScores(scores)

print("Total:", result.total)
print("Average:", result.avg)
print("Highest:", result.highest)
print("Lowest:", result.lowest)
```

### Example 4: String Manipulation

```javascript
action formatName(firstName, lastName)
  full = firstName + " " + lastName
  upper = toUpperCase(full)
  lower = toLowerCase(full)
end

result = formatName("john", "doe")
print("Full name:", result.full)
print("Uppercase:", result.upper)
print("Lowercase:", result.lower)
```

## Tips and Best Practices

1. **Use descriptive variable names**: `totalScore` is better than `ts`
2. **Keep actions small and focused**: Each action should do one thing well
3. **Comment complex logic**: Help others (and future you) understand your code
4. **Test incrementally**: Run your code frequently to catch errors early
5. **Use built-in functions**: They're tested and optimized

## Common Pitfalls

1. **Forgetting `end` keywords**: Every `action`, `check`, `each`, and `as` needs an `end`
2. **Off-by-one errors in loops**: Remember arrays are 0-indexed
3. **Infinite loops**: Make sure your `as` loop condition will eventually be false
4. **Variable shadowing**: Be aware when reusing variable names in different scopes

## Next Steps

- Read the [full README](README.md) for complete language specification
- Check out [IMPLEMENTATION.md](IMPLEMENTATION.md) for technical details
- Explore the [examples](examples/) directory for more code samples
- Join the community and contribute!

## Getting Help

- Read the documentation in this repository
- Check the examples directory for code samples
- Review test files for usage patterns
- Open an issue if you find a bug

## License

MIT License - see LICENSE file for details
