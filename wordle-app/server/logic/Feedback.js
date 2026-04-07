function feedback(guess, correct) {

  const result = [];
  const used = Array(correct.length).fill(false);

  //felhantering
  if (!guess) {
    throw new Error("Input cannot be empty");
  }

  if (guess.length !== correct.length) {
    throw new Error("Your guess must be the same lenght as the correct word");
  }

  if (!/^[A-Za-zÅÄÖåäö]+$/.test(guess)) {
    throw new Error("Your guess can only contain letters");
  }

  /* itterera genom för att hitta - 
  letter: correct, misplaced | incorrect */

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correct[i]) {
      result[i] = `${guess[i]}: correct`;
      used[i] = true;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i]) continue;

    const letter = guess[i];
    let foundIndex = -1;

    for (let j = 0; j < correct.length; j++) {
      if (!used[j] && correct[j] === letter) {
        foundIndex = j;
        break;
      }
    }
    
    if (foundIndex !== -1) {
      result[i] = `${letter}: misplaced`;
      used[foundIndex] = true;
    } else {
      result[i] = `${letter}: incorrect`;
    }
  }

  return result;
}

export default feedback;