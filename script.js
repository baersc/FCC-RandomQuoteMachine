/* eslint-env browser, jquery */
function pigLatin(str) {
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

    end = newWord[0] === newWord.search(vowels)
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

let quoteData = [];
let rndQuote;
let tweetAuthor;
let tweetQuote;

function getQuote() {
  $.ajax({
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?count=10',
    type: 'GET',
    data: {},
    dataType: 'json',
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-Mashape-Authorization', 'R1pSy8lvbjmshWCFezzI9awY6dpHp1oAAibjsnOqZK6WWOy4Z1');
    },
    success: (data) => {
      quoteData = data;
    },
  });
}

function makeTweet(quote, author) {
  const transformQuote = quote.replace(/;/g, ',');
  const testLength = quote + author;
  const changeLength = testLength.length - 134;

  tweetQuote = testLength.length > 137
    ? '"'.concat(transformQuote.slice(0,
      (transformQuote.length - changeLength)), '..."')
    : '"'.concat(quote, '"');

  tweetAuthor = author;
}

function change(quote, author) {
  $('.quote-text').fadeOut(800, function fadeText() {
    $(this).text(quote).fadeIn(800);
  });

  $('.quote-author').fadeOut(800, function fadeAuthor() {
    $(this).text(author).fadeIn(800);
  });

  if ($('.box i').is(':hidden')) {
    $('.box i').fadeIn(800);
  }
  $('.box i').fadeOut(800).fadeIn(800);

  makeTweet(quote, author);
}

function focusOnInput() {
  $(this).on('click', () => {
    $('textarea#custom-translation').focus();
  });
}

$(document).ready(() => {
  getQuote();

  $('.buttons').on('click', () => {
    document.activeElement.blur();
  });

  $('.fetch-button').on('click', () => {
    rndQuote = quoteData[Math.floor(Math.random() * quoteData.length)];
    change(rndQuote.quote, rndQuote.author);
    $('.quote-text').focus();
  });

  $('.pig-button').on('click', () => {
    change(pigLatin(rndQuote.quote), pigLatin(rndQuote.author));
  });

  $('.custom-button').on('click', () => {
    $('.fetch-button, .pig-button, .custom-button')
      .prop('disabled', true);
    $('textarea#custom-translation').attr('disabled', false);

    if ($('.form-hide').is(':hidden')) {
      $('.form-hide').fadeIn(400);
    }
    focusOnInput();
  });

  $('.hide-button').on('click', () => {
    $('.form-hide').fadeOut(400);


    $('.fetch-button, .pig-button, .custom-button')
      .prop('disabled', false);
  });

  $('.about-close-button').on('click', () => {
    $('.about-hide').fadeOut(400);

    if ($('.form-hide').is(':visible')) {
      $('.about-button, .twitter-button, .translate-button, .form-hide')
        .prop('disabled', false);
      $('textarea#custom-translation').attr('disabled', false);
    } else {
      $('.buttons').prop('disabled', false);
    }
  });

  $('.about-button').on('click', () => {
    $('.buttons').prop('disabled', true);
    $('textarea#custom-translation').attr('disabled', true);

    if ($('.about-hide').is(':hidden')) {
      $('.about-hide').fadeIn(400);
    }
  });

  $('.translate-button').on('click', () => {
    const customText = $('textarea#custom-translation').val();

    change(pigLatin(customText), 'Me');
    $('body').scrollTop(0);
    $('.quote-text').focus();
  });

  $('.clear-button').on('click', () => {
    $('textarea#custom-translation').val('');
    focusOnInput();
  });

  $('.twitter-button').on('click', () => {
    window.open('http://twitter.com/intent/tweet?text='.concat(tweetQuote, ' ',
      tweetAuthor));
  });
});
