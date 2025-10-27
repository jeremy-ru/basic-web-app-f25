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

  // Power/exponent questions
  if (lowerQuery.includes("power")) {
    return calculatePower(query);
  }

  // Anagram questions
  if (lowerQuery.includes("anagram")) {
    return findAnagram(query);
  }

  // Multiple operations questions (like addition and multiplication together)
  if (hasMultipleOperations(query)) {
    return evaluateMultipleOperations(query);
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

function calculatePower(query: string): string {
  const numbers = extractNumbers(query);
  
  if (numbers.length === 2) {
    const base = numbers[0];
    const exponent = numbers[1];
    
    // For very large numbers, use BigInt to avoid floating point precision issues
    if (exponent > 100) {
      try {
        // Use BigInt for very large exponents to maintain precision
        let result = BigInt(1);
        for (let i = 0; i < exponent; i++) {
          result *= BigInt(base);
        }
        return result.toString();
      } catch (error) {
        // Fallback to scientific notation for extremely large numbers
        return (base ** exponent).toExponential();
      }
    } else {
      // For smaller numbers, use regular exponentiation
      const result = Math.pow(base, exponent);
      return result.toString();
    }
  }
  
  return "I need both a base and an exponent to calculate the power.";
}

function findAnagram(query: string): string {
  // Extract the target word and candidate words from the query
  const anagramMatch = query.match(/anagram of (\w+):\s*([\w,\s]+)/i);
  
  if (!anagramMatch) {
    return "I couldn't understand the anagram question.";
  }
  
  const targetWord = anagramMatch[1].toLowerCase();
  const candidatesString = anagramMatch[2];
  
  // Extract candidate words (split by commas and trim)
  const candidates = candidatesString.split(',').map(word => word.trim().toLowerCase());
  
  // Find anagrams
  const anagrams: string[] = [];
  
  for (const candidate of candidates) {
    if (isAnagram(targetWord, candidate)) {
      anagrams.push(candidate);
    }
  }
  
  if (anagrams.length === 0) {
    return "None of the words are anagrams.";
  }
  
  return anagrams.join(", ");
}

function isAnagram(word1: string, word2: string): boolean {
  // Remove any non-alphabetic characters and sort letters
  const cleanWord1 = word1.replace(/[^a-z]/g, '');
  const cleanWord2 = word2.replace(/[^a-z]/g, '');
  
  // If lengths are different, they can't be anagrams
  if (cleanWord1.length !== cleanWord2.length) {
    return false;
  }
  
  // Sort letters and compare
  const sorted1 = cleanWord1.split('').sort().join('');
  const sorted2 = cleanWord2.split('').sort().join('');
  
  return sorted1 === sorted2;
}

function hasMultipleOperations(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  const operationWords = ['plus', 'minus', 'multiplied', 'divided', 'times'];
  let operationCount = 0;
  
  for (const op of operationWords) {
    if (lowerQuery.includes(op)) {
      operationCount++;
    }
  }
  
  // Also check for multiple symbols
  const symbolCount = (query.match(/[\+\-\*\/]/g) || []).length;
  
  return (operationCount + symbolCount) >= 2;
}

function evaluateMultipleOperations(query: string): string {
  const lowerQuery = query.toLowerCase();
  const numbers = extractNumbers(query);
  
  if (numbers.length < 2) {
    return "I need at least two numbers to perform operations.";
  }

  // For the specific pattern "A plus B multiplied by C"
  // We need to do multiplication first: A + (B * C)
  if (lowerQuery.includes("plus") && lowerQuery.includes("multiplied")) {
    if (numbers.length >= 3) {
      const multiplicationResult = numbers[1] * numbers[2];
      const finalResult = numbers[0] + multiplicationResult;
      return finalResult.toString();
    }
  }

  // Simple fallback: if we can't parse complex expressions, just extract and calculate sequentially
  // This handles cases like "1 plus 2 plus 3" etc.
  try {
    const tokens = tokenizeExpression(query);
    if (tokens.length > 0) {
      const result = evaluateTokens(tokens);
      return result.toString();
    }
  } catch (error) {
    // If token evaluation fails, fall back to sequential processing
  }
  
  // Fallback: process operations in order they appear
  let result = numbers[0];
  let currentIndex = 1;
  
  const words = query.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (currentIndex >= numbers.length) break;
    
    if (word === 'plus' || word === '+' || word === 'added' || word === 'and') {
      result += numbers[currentIndex++];
    } else if (word === 'minus' || word === '-' || word === 'subtracted') {
      result -= numbers[currentIndex++];
    } else if (word === 'multiplied' || word === 'times' || word === '*' || word === 'x') {
      result *= numbers[currentIndex++];
    } else if (word === 'divided' || word === '/' || word === 'over') {
      if (numbers[currentIndex] === 0) return "Cannot divide by zero";
      result /= numbers[currentIndex++];
    }
  }
  
  return result.toString();
}

function tokenizeExpression(query: string): (number | string)[] {
  const tokens: (number | string)[] = [];
  const words = query.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    // Check for numbers
    const numberMatch = word.match(/\d+/);
    if (numberMatch) {
      tokens.push(parseInt(numberMatch[0]));
      continue;
    }
    
    // Check for operators
    if (word === 'plus' || word === '+' || word === 'added' || word === 'and') {
      tokens.push('+');
    } else if (word === 'minus' || word === '-' || word === 'subtracted') {
      tokens.push('-');
    } else if (word === 'multiplied' || word === 'times' || word === '*' || word === 'x') {
      tokens.push('*');
    } else if (word === 'divided' || word === '/' || word === 'over') {
      tokens.push('/');
    }
  }
  
  return tokens;
}

function evaluateTokens(tokens: (number | string)[]): number {
  // First pass: handle multiplication and division
  const processed: (number | string)[] = [];
  let i = 0;
  
  while (i < tokens.length) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      const left = processed.pop() as number;
      const operator = tokens[i];
      const right = tokens[i + 1] as number;
      
      if (operator === '*') {
        processed.push(left * right);
      } else {
        if (right === 0) throw new Error("Division by zero");
        processed.push(left / right);
      }
      i += 2;
    } else {
      processed.push(tokens[i]);
      i++;
    }
  }
  
  // Second pass: handle addition and subtraction
  let result = processed[0] as number;
  
  for (let i = 1; i < processed.length; i += 2) {
    const operator = processed[i] as string;
    const operand = processed[i + 1] as number;
    
    if (operator === '+') {
      result += operand;
    } else if (operator === '-') {
      result -= operand;
    }
  }
  
  return result;
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