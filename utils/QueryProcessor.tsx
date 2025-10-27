export default function QueryProcessor(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Shakespeare
  if (lowerQuery.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  // Andrew ID
  if (lowerQuery.includes("andrewid")) {
    return "zru";
  }

  // Name
  if (lowerQuery.includes("name")) {
    return "Jeremy";
  }

  // Largest number questions
  if (lowerQuery.includes("largest") || lowerQuery.includes("biggest")) {
    return findLargestNumber(query);
  }

  // Square and cube questions
  if (lowerQuery.includes("square") && lowerQuery.includes("cube")) {
    return findSquareAndCube(query);
  }

  // Prime number questions
  if (lowerQuery.includes("prime")) {
    return findPrimes(query);
  }

  // Math problems
  const mathResult = processMathQuery(query);
  if (mathResult !== null) {
    return mathResult;
  }

  return "";
}

function findLargestNumber(query: string): string {
  const numbers = extractNumbers(query);
  
  if (numbers.length === 0) {
    return "I couldn't find any numbers in your question.";
  }
  
  const largest = Math.max(...numbers);
  return largest.toString();
}

function findSquareAndCube(query: string): string {
  const numbers = extractNumbers(query);
  const results: number[] = [];
  
  for (const num of numbers) {
    // A number is both a square and a cube if it's a perfect 6th power
    const sixthRoot = Math.pow(num, 1/6);
    
    // Check if the sixth root is very close to an integer
    if (Math.abs(Math.round(sixthRoot) - sixthRoot) < 0.0000001) {
      results.push(num);
    }
  }
  
  if (results.length === 0) {
    return "None of the numbers are both a square and a cube.";
  }
  
  return results.join(", ");
}

function findPrimes(query: string): string {
  const numbers = extractNumbers(query);
  const primes: number[] = [];
  
  for (const num of numbers) {
    if (isPrime(num)) {
      primes.push(num);
    }
  }
  
  if (primes.length === 0) {
    return "None of the numbers are prime.";
  }
  
  return primes.join(", ");
}

function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  // Check for divisors up to sqrt(num)
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  
  return true;
}

function processMathQuery(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  
  // Addition - improved pattern matching
  if (lowerQuery.includes("plus") || query.includes("+")) {
    const numbers = extractNumbers(query);
    if (numbers.length >= 2) {
      const sum = numbers.reduce((a, b) => a + b, 0);
      return sum.toString();
    }
  }
  
  // Multiplication
  if (lowerQuery.includes("multiplied") || query.includes("*")) {
    const numbers = extractNumbers(query);
    if (numbers.length >= 2) {
      const product = numbers.reduce((a, b) => a * b, 1);
      return product.toString();
    }
  }
  
  // Subtraction
  if (lowerQuery.includes("minus") || query.includes("-")) {
    const numbers = extractNumbers(query);
    if (numbers.length === 2) {
      return (numbers[0] - numbers[1]).toString();
    }
  }
  
  // Division
  if (lowerQuery.includes("divided") || query.includes("/")) {
    const numbers = extractNumbers(query);
    if (numbers.length === 2) {
      return numbers[1] !== 0 ? (numbers[0] / numbers[1]).toString() : "Cannot divide by zero";
    }
  }

  // Power/exponent questions
  if (lowerQuery.includes("power")) {
    const numbers = extractNumbers(query);
    if (numbers.length === 2) {
      return Math.pow(numbers[0], numbers[1]).toString();
    }
  }

  // Handle simple arithmetic expressions like "1+2" or "3*4"
  const simpleMathMatch = query.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
  if (simpleMathMatch) {
    const num1 = parseInt(simpleMathMatch[1]);
    const num2 = parseInt(simpleMathMatch[3]);
    const operator = simpleMathMatch[2];
    
    switch (operator) {
      case '+': return (num1 + num2).toString();
      case '-': return (num1 - num2).toString();
      case '*': return (num1 * num2).toString();
      case '/': return num2 !== 0 ? (num1 / num2).toString() : "Cannot divide by zero";
    }
  }
  
  return null;
}

function extractNumbers(text: string): number[] {
  const numberMatches = text.match(/\d+/g);
  return numberMatches ? numberMatches.map(Number) : [];
}