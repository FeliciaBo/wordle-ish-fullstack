 function chooseWord(words, length, unique) {

  //felhantering
  
   if (!Array.isArray(words)) {
    throw new Error("Words must be an array");
  }

  if (words.length === 0) {
    throw new Error("Word list cannot be empty");
  }

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Word length must be a positive integer");
  }

  if (typeof unique !== "boolean") {
    throw new Error("Unique must be boolean");
  }


  //filtrera ord

   let filteredWords = words.filter(word => word.length === length);

if (unique) {
    filteredWords = filteredWords.filter(word => {
      const letters = new Set(word.split(""));
      return letters.size === word.length;
    });
  }

  if (filteredWords.length === 0) {
    throw new Error("No matching word found");
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  
  return filteredWords[randomIndex];
}

export default chooseWord;