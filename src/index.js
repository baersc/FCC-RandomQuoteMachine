/* eslint-env browser, jquery */

import $ from 'jquery';
import './responsive.css';
import pigLatin from './piglatin';

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
