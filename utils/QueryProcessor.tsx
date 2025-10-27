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

    // Handle basic arithmetic
  if (query.includes("+") || query.includes("-") || query.includes("*") || query.includes("/")) {
    try {
      // Extract the math expression - looking for patterns like "what is 1+2" or "calculate 3*4"
      const mathMatch = query.match(/(\d+[\+\-\*\/]\d+)/);
      if (mathMatch) {
        const expression = mathMatch[1];
        const result = eval(expression);
        return result.toString();
      }
    } catch (error) {
      return "I couldn't calculate that expression.";
    }
  }

  return "";
}
