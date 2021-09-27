function blackjack(){
  let deckOfCards = [];
  let deckLimit = 0;
  let round = 1;
  let scores = {player: 0, dealer: 0};
  function createDeck (numDecks) { //number of decks as parameter
    const suits = ["Spades","Hearts","Clubs","Diamonds"];
    for(let i = 0; i < suits.length; i++){ //suits
      for(let j = 1; j <= 13; j++){ //numbers
        for(let k = 0; k < numDecks; k++){
          deckOfCards.push({[j]:suits[i]});
        }
      }
    }
  }
  function shuffleDeck (numDecks) {
    createDeck(numDecks);
    const shuffledDeck = [];
    while(deckOfCards.length != 0)
    {
      let index = Math.floor(Math.random()*deckOfCards.length);
      shuffledDeck.push(deckOfCards[index]);
      deckOfCards = deckOfCards.slice(0,index).concat(deckOfCards.slice(index+1));
    }
    deckOfCards = shuffledDeck;
    deckLimit = Math.floor(deckOfCards.length * 0.1);
  }

  function play() {
    const dealerHand = [];
    const playerHand = [];

    function initialHands(){ // Deal out initial hands
      dealerHand.push(deckOfCards.pop());
      playerHand.push(deckOfCards.pop());
      dealerHand.push(deckOfCards.pop());
      playerHand.push(deckOfCards.pop());
      hitOrStay();
    }

    function getHandValue(hand) { // Gets value of the hand
      let total = 0;
      let containsAce = false;
      hand.sort((a,b)=> b-a);
      hand.forEach(el => {
        let val = Number(Object.keys(el));
        if(val === 1) containsAce = true; 
        if(val > 10) val = 10;
        total += val;
      });
      if(containsAce && total <= 11) total += 10;
      return total;
    }

    function hitOrStay(){
      let dVal = getHandValue(dealerHand);
      let pVal = getHandValue(playerHand);

      console.clear();
      console.log(`Current Round: ${round} \nDealer: ${scores["dealer"]}, Player: ${scores["player"]}`);
      console.log("Dealer's Hand: ??");
      displayCards(dealerHand,true);
      console.log("Player's Hand: ", pVal);
      displayCards(playerHand);
      
      if(pVal === 21 && playerHand.length === 2) winCases(dVal, "blackjack",dealerHand,playerHand); //blackjack
      else {
        const ask = prompt("Hit or Stay? (h/s)");
        if(ask.toLowerCase() === 'h') {
          playerHand.push(deckOfCards.pop());
          pVal = getHandValue(playerHand);
          if(pVal >= 21) winCases(dVal,pVal,dealerHand,playerHand);
          else hitOrStay();
        }
        else if (ask.toLowerCase() === 's') {
          console.log("stay");
          while(dVal <= 16 ) {
            dealerHand.push(deckOfCards.pop());
            dVal = getHandValue(dealerHand);
          }
          winCases(dVal, pVal,dealerHand,playerHand);
        }
        else {
          hitOrStay();
        }
      }
    }
    initialHands();
  }

  function winCases(dealer, player,dH,pH){
    console.clear();
    console.log(`Round: ${round}, \nDealer: ${scores["dealer"]}, Player: ${scores["player"]}`)
    console.log("Dealer's Hand: ",dealer);
    displayCards(dH);
    console.log("Player's Hand: ",player);
    displayCards(pH);
    if(player === "Blackjack") { //player wins automatically - blackjack
      scores["player"]+=1;
      console.log("Blackjack - Player wins!");
    } else if(player === dealer) { //player and dealer tie
      console.log("Push - it's a tie!");
    } else if(player === 21) {
      scores["player"]+1;
      console.log("Player wins!");
    } else if(player > 21) { //player loses
      scores["dealer"]+=1;
      console.log("Player loses! Went over 21.");
    } else if(dealer > 21) { //dealer loses
      scores["player"]+=1;
      console.log("Player wins! Dealer went over 21!");
    } else if(dealer > player) { //player loses
      scores["dealer"]+=1;
      console.log("Dealer wins!");
    }
    else {
      console.log("Player wins!");
      scores["player"]+=1;
    }
    playAgain();
  }

  function playAgain(){
    if(deckOfCards.length <= deckLimit){
      console.log("low Cards");
      shuffleDeck(8);
    }
    const ask = prompt("Play again? (y/n)");
    if(ask.toLowerCase() === 'y'){
      round++;
      play();
    }
    else if(ask.toLowerCase() === 'n'){
      console.clear();
      console.log(`Thank you for playing! - The final score was Player: ${scores["player"]}, Dealer: ${scores["dealer"]}.`);
    }
    else {
      console.log('Invalid input!');
      playAgain();
    }
  }

  function displayCards(hand,hide){
    const hVal = hand.map(el => {
      let val = Number(Object.keys(el));
      if (val === 11) val = "J";
      if (val === 12) val = "Q";
      if (val === 13) val = "K";
      if (val === 1) val = "A";
      return val;
    });
    const hSuit = hand.map(el => {
      let suit = Object.values(el);
      if(suit[0] === 'Spades') suit = '\u2660';
      if(suit[0] === 'Hearts') suit = '\u2665';
      if(suit[0] === 'Clubs') suit = '\u2663';
      if(suit[0] === 'Diamonds') suit = '\u2666';
      return suit;
    });

    if(hide){
      hVal[0] = "?";
      hSuit[0] = " ";
    }
    
    let topBttm = "", top = "", bottom = "", mid = "", mid2 = "";
    
    for(let i = 0; i < hVal.length; i++){
      topBttm += "--------- ";
      hVal[i] === 10 ? 
        top += `|${hVal[i]} ${hSuit[i]}   | ` : 
        top += `|${hVal[i]} ${hSuit[i]}    | `;
      hVal[i] === 10 ? 
        bottom += `|   ${hSuit[i]} ${hVal[i]}| ` : 
        bottom += `|    ${hSuit[i]} ${hVal[i]}| `;
      mid += `|       | `;
      mid2 += `|       | `;
    }
    
    console.log(`${topBttm}\n${top}\n${mid}\n${mid2}\n${bottom}\n${topBttm}`);
  }

  shuffleDeck(8); //initiation of shuffled deck
  play();
}

blackjack();