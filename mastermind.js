// Global variable declarations
const prompt = require('prompt-sync')();
const codePegs = ['#', '$',  '%',  '&', '@', '!'];
let guessesArray = [];
let guessedLine;
const gameboardArray = [];
let turnCounter = 0;
let isGameOver = false;
let userObj = {};
let solution =[];
let guess;
let maxTurns;
let feedback = [];

// Function declarations
//////////////////////////////////////
function calculateFeedback(solution, guess){
  const solutionArray = solution;
  const feedback = [];
  const secondSolutionArray = [];

  // check to see if one of the elements of in guess corresponds to solution 
  for (let i=0; i < guess.length; i++){
    if (solutionArray[i] === guess[i]){
      feedback.push('x');
    } else{
      secondSolutionArray.push(solutionArray[i]);
     }
  }
  ///if not exact match, add element to second solution
  for (let i=0; i < guess.length; i++){
      if (secondSolutionArray.includes(guess[i])){
      feedback.push('*');

      //need to splice out value to avoid repeat *'s
      let index = secondSolutionArray.indexOf(guess[i], 0)
      secondSolutionArray.splice(index,1);
    }
  }
  return feedback;
}

//////////////////////////////////////
function solutionGenerator(inputArr){
  const randomized = inputArr.sort(() => 0.5 - Math.random());
  const reduced = randomized.slice(0, 4);
  return reduced;
}

//////////////////////////////////////
function determineMaxTurns() {
  if (userObj.level === 'difficult') return 6
  else return 10
}

//////////////////////////////////////
function checkGuess(a, b){
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
    }
  return true; 
}

//////////////////////////////////////
//checks if guess matches solution
function evaluateTurn(){

  //changed conditionals slightly to account for user getting answer right on last guess
  if (checkGuess(guessesArray[guessesArray.length - 1], solution) === true && turnCounter <= maxTurns) {
    isGameOver = true
    console.log(`You have cracked the code! Take your money and run.`);
    printMoney();
  };
  if (turnCounter === maxTurns && checkGuess(guessesArray[guessesArray.length - 1], solution) !== true){
    isGameOver = true
    console.log(`The cops have arrived! You are sentenced to 15 years behind bars.`);
    printCops();
    console.log(`The code was ${solution}`)
  };
}

//////////////////////////////////////
//this gameboard will be shown in the opening sequence **only**
const gameBoardArrayStart = () => {

    let questionMarkBoard = 
    ['|-------@-@-@-------|',
     '|----@--------@-----|',
     '|--@------------@---|',
     '|---------------@---|',
     '|-------------@-----|',
     '|-----------@-------|',
     '|---------@---------|',
     '|---------@---------|',
     '|-------------------|',
     '|---------@---------|'];

    questionMarkBoard.forEach((el) => {
        console.log(el);
    });
}

///////////////////////////////////////
//Most recent guesses Line Template fx
function newLineWithSymbols () {
  for (let i = turnCounter - 1; i < guessesArray.length; i += 1) {
      guessedLine = '|----' + guessesArray[i][0] + '----' + guessesArray[i][1] + '----' + guessesArray[i][2] + '----' + guessesArray[i][3] + '----| ' + feedback;
  } return guessedLine; //could return call splice function 
}

//////////////////////////////////////
//Splice most recent guesses into gameboard using turncount as input
function splice () {
  if (guessesArray.length > 0) {
  gameboardArray.splice((turnCounter - 1), 1, guessedLine)
  }
}

/////////////////////////////////
function createBoard () {
  if (userObj.level === 'difficult') {
    for (let i = 0; i < 6; i += 1) {
      gameboardArray.push('|----?----?----?----?----|  ')
    }
  } else {
    for (let i = 0; i < 10; i += 1) {
      gameboardArray.push('|----?----?----?----?----|  ')
    }
  }
}

//////////////////////////////////////
//introduces game play
//returns user object
function welcome(){
    let userObj = {};

    let userName = prompt('What shall we call you? ');

    //adds userName to user object
    userObj["userName"] = userName;

    printLines();
    console.log(`Welcome, ${userName}! Let's find out if you have what it takes to be a mastermind.`);

    let breakOrMake = 'codebreaker';

    if (breakOrMake === 'codebreaker'){
      console.log('Your task is simple. You must break into a vault and you will be rewarded.')
      let level = prompt('Would you like an easy or difficult challenge? ');
    
      //error handling, user must input easy or difficult
      level = level.toLowerCase();
      while(level !== 'easy' && level !== 'difficult'){
      level = prompt('Easy or difficult? ');
      level = level.toLowerCase();
      }

      printLines();

      //adds level to user object
      userObj["level"] = level;

      console.log(`Ah, ${level}! Wonderful. The secret code to enter is a sequence of four symbols. \nBut careful, your answer must have the correct symbols in the correct order. \nYou have six choices: @ # $ % & !`);

    userObj["player"] = breakOrMake;
    }
    return userObj;
}

//////////////////////////////////////
function printLines(){
  console.log(`--------------------------------------------`);
}

//////////////////////////////////////
//input: array of * or x
//logs to console how many correct symbols in correct position, and how many correct symbols in wrong position user has
function response(countArr){

    let xCount = countArr.filter(element => element === 'x').length;
    let starCount = countArr.filter(element => element === '*').length;

    //checks counts to see if we need to make 'symbol' plural
    let starAddS = '';
    let xAddS = '';
    if(starCount !== 1){
      starAddS = 's';
    }
    if (xCount !== 1){
      xAddS = 's';
    }

    console.log(`You have ${xCount} correct symbol${xAddS} in the correct position. \n(Shown as 'x' on the board)`);
    console.log(`You have ${starCount} correct symbol${starAddS} in the wrong position. \n(Shown as '*' on the board)`); //(shown as x)
}

//////////////////////////////////////
//prints a triangle of $ to console
function printMoney(){
  for (let i = 0; i < 6; i++){
    console.log(`${' '.repeat(5 - i)}${'$'.repeat(1 + 2*i)}`)
  }
}

//////////////////////////////////////
//prints cop car
function printCops(){
console.log("          ______=====______        ");
console.log("    _____//////////////////_______ ");
console.log("   //////_________//______//////// ");
console.log("  /        P O L I C E          /  ");
console.log(" /______ /// ______ /// _______/   ");
console.log("        ////       ////            ");    
}

//////////////////////////////////////
//promts user for their guess
//checks if user gave valid input
//returns an array with user guess
function askGuess(){
    let input = prompt('Input your guess: ');
    let arrayInput = [];

    //checking if input string does not have any white spaces
    //transforms string into array 
    if (input.indexOf(' ') === -1){
      arrayInput = input.split('');
    } else {
      arrayInput = input.split(' ')
    }

     //error handling: checks if user did not input 4 characters
    while(arrayInput.length !== 4){
      input = prompt('Please input four symbols. Your choices are: @ # $ % & ! ')
      arrayInput = input.split(' ')
    }

    //error handling: checks if every element in arrayInput is a valid symbol. 
    let validInput = arrayInput.every(element => element === '@' || element === '#' || element === '$' || element === '%' || element === '&' || element === '!');

    //prompts user for input while validInput is false. Updates validInput with each iteration of loop. 
    while (!validInput) {
      input = prompt('Please input four symbols. Your choices are: @ # $ % & ! ')
      arrayInput = input.split(' ')
      validInput = arrayInput.every(element => element === '@' || element === '#' || element === '$' || element === '%' || element === '&' || element === '!');
    }
     return arrayInput;
}

//////////////////////////////////////
//game play logic
function mastermindTheGame () {
  gameBoardArrayStart();
  userObj = welcome();
  maxTurns = determineMaxTurns();
  createBoard();
  solution = solutionGenerator(codePegs);
  gameboardArray.forEach(el => {console.log(el)});

  while(!isGameOver){

    guess = askGuess(); 
    guessesArray.push(guess);

    turnCounter++;
    evaluateTurn();    

    if (!isGameOver) {
    feedback = calculateFeedback(solution, guess)
    newLineWithSymbols();
    splice();
    response(feedback);
    gameboardArray.forEach(el => {console.log(el)});
    }
  }
}

mastermindTheGame();