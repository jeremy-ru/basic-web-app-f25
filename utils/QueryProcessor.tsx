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

  // Square and cube questions
  if (lowerQuery.includes("square") && lowerQuery.includes("cube")) {
    const numbers = extractNumbers(query);
    for (const num of numbers) {
      const sqrt = Math.sqrt(num);
      const cbrt = Math.cbrt(num);
      if (Number.isInteger(sqrt) && Number.isInteger(cbrt)) {
        return num.toString();
      }
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