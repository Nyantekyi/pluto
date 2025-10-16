import { PlutoInterpreter } from '../src/index.js';

console.log('=== Example 1: Basic Assignment ===');
let pluto = new PlutoInterpreter();
pluto.execute(`
  x = 10
  y = 20
  print("x + y =", x + y)
`);

console.log('\n=== Example 2: Action with Implicit Return ===');
pluto = new PlutoInterpreter();
const result1 = pluto.execute(`
  action square(x)
    x * x
  end
  
  square(5)
`);
console.log('Result:', result1);

console.log('\n=== Example 3: Action with Multiple Return Values ===');
pluto = new PlutoInterpreter();
const result2 = pluto.execute(`
  action calculate(a, b)
    sum = a + b
    diff = a - b
    prod = a * b
  end
  
  calculate(10, 5)
`);
console.log('Result:', result2);

console.log('\n=== Example 4: Check Statement ===');
pluto = new PlutoInterpreter();
pluto.execute(`
  x = 10
  check (x > 5)
    print("x is greater than 5")
  else
    print("x is not greater than 5")
  end
`);

console.log('\n=== Example 5: Each Loop ===');
pluto = new PlutoInterpreter();
pluto.execute(`
  items = [1, 2, 3, 4, 5]
  total = 0
  each (item in items)
    total = total + item
  end
  print("Sum of items:", total)
`);

console.log('\n=== Example 6: As (While) Loop ===');
pluto = new PlutoInterpreter();
pluto.execute(`
  count = 5
  print("Countdown:")
  as (count > 0)
    print(count)
    count = count - 1
  end
  print("Done!")
`);

console.log('\n=== Example 7: Built-in Functions ===');
pluto = new PlutoInterpreter();
pluto.execute(`
  arr = [3, 1, 4, 1, 5, 9, 2, 6]
  print("Array:", arr)
  print("Min:", minimum(arr))
  print("Max:", maximum(arr))
  print("Sum:", sum(arr))
  print("Average:", average(arr))
`);

console.log('\n=== Example 8: String Operations ===');
pluto = new PlutoInterpreter();
pluto.execute(`
  text = "Hello, World!"
  print("Original:", text)
  print("Uppercase:", toUpperCase(text))
  print("Lowercase:", toLowerCase(text))
  print("Length:", length(text))
`);

console.log('\n=== Example 9: Complex Example from README ===');
pluto = new PlutoInterpreter();
const result3 = pluto.execute(`
  action splitName(fullName)
    parts = split(fullName, " ")
    first = parts[0]
    last = parts[1]
  end
  
  splitName("John Doe")
`);
console.log('Result:', result3);
