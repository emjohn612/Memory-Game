
// Variables
var suits = ["fa fa-diamond", "fa fa-anchor", "fa fa-cube", "fa fa-paper-plane-o", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb", "fa fa-cube", "fa fa-paper-plane-o", "fa fa-bolt", "fa fa-leaf", "fa fa-bolt", "fa fa-diamond", "fa fa-bicycle", "fa fa-anchor", "fa fa-bomb"];
var card = $('.card');
var symbol = $('.card').children();
var openCards = [];
var guess1 = "";
var guess2 = "";
var count = 0;
var moves = 0;
var starRating = 3;
var timer = {
  seconds: 0,
  minutes: 0,
  clearTime: -1
};

window.onload = function() {
  displayCards();
}

/**
 * @description: Reset the game
 *
 *  - remove the symbol from the cards
 *  - remove all "match","open" and "show" classes from each cards
 *  - reset openCards array
 *  - reset moves
 *  - remove modal from screen
 *  - reset timer
 *  - reset stars
 *  - suffle the suits array
 *  - add the symbols to each card
 *
 */

function displayCards(){
  symbol.removeClass();
  $('li').removeClass('open show match');
  openCards = [];
  moves = 0;
  $('.moves').text('0');
  $('.modal').css("display","none");
  resetTimer();
  resetStars();
  shuffle(suits);
  symbol.each(function(index, element){
    $(element).addClass(suits[index % suits.length]);
  })
}

$('.restart').on('click',displayCards);


/**
 * @description: add card to the open card array
 * @param: the card clicked
 */

function addCard(selected){
  openCards.push(selected);
  console.log(openCards);
}

/**
 * @description: move counter
 *
 *  - add one to move counter
 *  - display updated moves on the score-panel
 *
 */

function numberOfMoves(){
  moves++;
  $('.moves').text(moves);
}

/**
 * @description: timer
 *
 *  - if the seconds are equal to 59
 *      add one to minutes
 *      set seconds back to 0
 *  - if not equal to 59
 *      add one to seconds
 *
 *  - add trailing 0
 *
 */

var timer = function() {
  if (timer.seconds === 59) {
    timer.minutes++;
    timer.seconds = 0;
  } else {
    timer.seconds++;
  }
  var formattedSec = "0";
  if (timer.seconds < 10) {
    formattedSec += timer.seconds;
  } else {
    formattedSec = String(timer.seconds);
  }

  var time = String(timer.minutes) + ":" + formattedSec;
  $(".timer").text(time);
};

/**
 * @description: start timer
 *
 *  - set seconds to 0
 *  - set minutes to 0
 *  - set timer to 0:00 on score-panel
 *  - set interval of one second for the function timer
 *
 */

function startTimer() {
  timer.seconds = 0;
  timer.minutes = 0;
  $(".timer").text("0:00");
  timer.clearTime = setInterval(timer, 1000);
}

/**
 * @description: reset timer
 *
 *  - set seconds to 0
 *  - set minutes to 0
 *  - set timer to 0:00 on score-panel
 *
 */

function resetTimer(){
  clearInterval(timer.clearTime);
  timer.seconds = 0;
  timer.minutes = 0;
  $(".timer").text("0:00");

}

/**
 * @description: remove star
 *
 *  - if moves equals 15
 *      remove star from score-panel
 *      set starRating to 2
 *
 *  - if moves equals 21
 *      remove star from score-panel
 *      set starRating to 1
 *
 */

function removeStar (){
  if(moves == 15){
    $('.stars').children().last().remove();
    starRating = 2;
    console.log(starRating);
  }
  if(moves == 21){
    $('.stars').children().last().remove();
    starRating = 1;
    console.log(starRating);
  }
}

/**
 * @description: reset stars
 *
 *  - set starRating back to 3
 *
 *  - if there are 2 stars
 *      add one star to score-panel
 *
 *  - if there is 1 star
 *      add two stars to score-panel
 *
 */

function resetStars() {
  starRating = 3;
  if($('.stars').children().length === 2){
    $('.stars').append('<li><i class="fa fa-star"></i></li>');
  }
  if($('.stars').children().length === 1){
    $('.stars').append('<li><i class="fa fa-star"></i></li>');
    $('.stars').append('<li><i class="fa fa-star"></i></li>');
  }
}

/**
 * @description: open winning modal
 * @param: starRating
 *
 *  - show modal
 *  - display starRating
 *
 */

function openModal(starRating){
  $('.modal').css("display","block");
  $(".starRating").text(String(starRating));
}

/**
 * @description: verify that the clicked card is a valid click
 * @param: the clicked card
 *
 *  - make sure the card does not have the class "open" or "match"
 *
 */

function validate(card) {
  return !(card.hasClass("match") || card.hasClass("open"));
}

/**
 * @description: on card click; flips card to show symbol, then compares to see if there is a match
 * @param: the card clicked
 *
 *   - If timer.seconds equals 0 and timer.minutes equals 0
 *     - start timer
 *   - If count is less than two
 *      - validate card
 *          add one to count: how many cards have been flipped
 *          add class "show" and "open" to the card clicked: showing the card face up
 *
 *        - If count equals one
 *            guess1 - first card flipped
 *            add guess1 to openCards array
 *        - If count does not equal one
 *            guess2 - second card flipped
 *            add guess2 to openCards array
 *
 *          - If guess1 equals guess2
 *              log 'match'
 *              add class 'match' to both cards flipped (guess1 and guess2)
 *
 *            - If the length of openCards and suits are equal
 *                open winning modal with the starRating
 *
 *          - If guess1 and guess2 do not match
 *              log 'miss'
 *              remove last two cards from openCards array
 *              remove class 'show' and 'open' from guess1 and guess2: flipping both cards face down
 *
 *     - reset count to 0
 */
card.click (function (evt) {
  // start timer
  if(timer.seconds === 0 && timer.minutes === 0){
    startTimer();
  }

  // show symbol
  if (count < 2){
    if (validate($(this))) {
      count++;
      $(evt.target).addClass('show open');
      var clickedCard = $(evt.target);

    if (count === 1) {
        guess1 = $(this).children('i').attr('class');
        addCard(guess1);
        numberOfMoves();
    } else {
        guess2 = $(this).children('i').attr('class');
        removeStar();
        addCard(guess2);

      if (guess1 === guess2) {
        console.log('match');
        setTimeout (function () {
          $("li").children("i[class='" + guess2 + "']").parent().addClass("match");
        }, 300);
        if (openCards.length === suits.length) {
          clearInterval(timer.clearTime);
          openModal(starRating);
        }
      } else {
          console.log('miss');
          openCards.pop();
          openCards.pop();
          setTimeout (function () {
            $("li").children("i[class='" + guess1 + "']").parent().removeClass("show open");
            $("li").children("i[class='" + guess2 + "']").parent().removeClass("show open");
          }, 600);
        }
    //reset count
    count = 0
    }
  }
}
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
