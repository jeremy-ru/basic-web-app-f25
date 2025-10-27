export default function QueryProcessor(query: string): string {
  if (query.toLowerCase().includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (query.toLowerCase().includes("andrewid")) {
    return "zru";
  }

  if (query.toLowerCase().includes("name")) {
    return "Jeremy";
  }

  // Handle "largest" questions
  if (query.toLowerCase().includes("largest")) {
    return findLargestNumber(query);
  }

  // Handle math problems (your existing code)
  const mathResult = processMathQuery(query);
  if (mathResult !== null) {
    return mathResult;
  }

  return "";
}

function findLargestNumber(query: string): string {
  // Extract all numbers from the query
  const numbers = extractNumbers(query);
  
  if (numbers.length === 0) {
    return "I couldn't find any numbers in your question.";
  }
  
  if (numbers.length === 1) {
    return `There's only one number: ${numbers[0]}`;
  }
  
  // Find the largest number
  const largest = Math.max(...numbers);
  return largest.toString();
}

function extractNumbers(text: string): number[] {
  const numberMatches = text.match(/\d+/g);
  return numberMatches ? numberMatches.map(Number) : [];
}

// Your existing math function (keep this)
function processMathQuery(query: string): string | null {
  // Your existing math processing logic here
  // ... (the code from previous examples)
  return null;
}