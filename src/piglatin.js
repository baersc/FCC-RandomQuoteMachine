export default function pigLatin(str) {
  const arr = str.split(' ');
  const pigarr = [];
  const hyphen = /-/;

  function translate(word) {
    let endPunct = '';
    let endPunct2 = '';
    let frontPunct = '';
    const letters = [];
    let end = '';

    const numbers = /[0-9]/;
    const vowels = /[aeiou]/i;
    const punct = /\W/;
    const alphas = /[a-z]/i;

    /* Words that begin with numbers and words that begin with punctuation
       and contain no vowels are passed without translation. */
    if (word[0].match(numbers) ||
        (word[0].match(punct) &&
        word.search(vowels) < 0)
    ) {
      return word;
    }

    /* Find and save punctuation from the end of the word */
    if (word[word.length - 1].match(punct)) {
      endPunct = word[word.length - 1];
    }

    /* Save another punctuation in the case of a comma inside
       quotation marks. */
    if (word.length > 1 &&
        word[word.length - 2] !== "'" &&
        word[word.length - 2].match(punct)
    ) {
      endPunct2 = word[word.length - 2];
    }

    /* Find and save punctuation from the end of the word */
    if (word[0].match(punct)) {
      frontPunct = word[0];
    }

    /* remove punctuation from the word, if we don't do this punctuation
       will show up inside of the word after translation. */
    for (let j = 0; j < word.length; j += 1) {
      if (word[j].match(alphas)) {
        letters.push(word[j]);
      }
    }
    const newWord = letters.join('');

    /* This is the actual translation, performs different actions depending
       on whether the word started with a vowel or not. */
    if (newWord[0].match(vowels) || newWord.search(vowels) < 0) {
      return frontPunct.concat(newWord, 'way', endPunct2, endPunct);
    }
    const position = newWord.search(vowels);
    const front = newWord.slice(0, position).toLowerCase();

    end = newWord[0] === newWord[0].toUpperCase()
      ? newWord[position].toUpperCase() + newWord.slice(position + 1)
      : newWord.slice(position);

    return frontPunct.concat(end, front, 'ay', endPunct2, endPunct);
  }

  for (let i = 0; i < arr.length; i += 1) {
    const word = arr[i];

    /* If word contains a hyphen, break it into two words and translate
       each independantly */
    if (word.length === 1 && word[0].match(hyphen)) {
      pigarr.push(word);
    } else if (word.match(hyphen)) {
      const hyphenLoc = word.indexOf('-');
      const firstWord = word.slice(0, hyphenLoc);
      const secondWord = word.slice(hyphenLoc + 1);
      pigarr.push(translate(firstWord).concat('-', translate(secondWord)));
    } else { /* If no hyphens, translate whole word */
      pigarr.push(translate(word));
    }
  }
  return pigarr.join(' '); /* Join the completed translation back into a
                              string and return, closing funciton. */
}
