import React, { useState } from 'react';
import { Input, Card, CardText, CardBody, CardTitle, Button } from 'reactstrap';


// RULES
//    High Card: Hands which do not fit any higher category are ranked by the value of their highest card. If the highest cards have the same value, the hands are ranked by the next highest, and so on.
//    Pair: 2 of the 5 cards in the hand have the same value. Hands which both contain a pair are ranked by the value of the cards forming the pair. If these values are the same, the hands are ranked by the values of the cards not forming the pair, in decreasing order.
//    Two Pairs: The hand contains 2 different pairs. Hands which both contain 2 pairs are ranked by the value of their highest pair. Hands with the same highest pair are ranked by the value of their other pair. If these values are the same the hands are ranked by the value of the remaining card.
//    Three of a Kind: Three of the cards in the hand have the same value. Hands which both contain three of a kind are ranked by the value of the 3 cards.
//    Straight: Hand contains 5 cards with consecutive values. Hands which both contain a straight are ranked by their highest card.
//    Flush: Hand contains 5 cards of the same suit. Hands which are both flushes are ranked using the rules for High Card.
//    Full House: 3 cards of the same value, with the remaining 2 cards forming a pair. Ranked by the value of the 3 cards.
//    Four of a kind: 4 cards with the same value. Ranked by the value of the 4 cards.
//    Straight flush: 5 cards of the same suit with consecutive values. Ranked by the highest card in the hand.


function App() {

  const [hand1, setHand1] = useState('')
  const [hand2, setHand2] = useState('')
  const [result, setResult] = useState('')

  const handleCompare = () => {
    let rankJ1 = calculateRank(hand1)
    let rankJ2 = calculateRank(hand2)

    if (rankJ1.rank > rankJ2.rank) {
      if (rankJ1.highValueTwo === 0) {

        setResult(`J1 gagne avec ${rankJ1.figure} : ${reFormatValue(rankJ1.highValue)}`)
      } else {
        setResult(`J1 gagne avec ${rankJ1.figure} : ${reFormatValue(rankJ1.highValue)} sur ${reFormatValue(rankJ1.highValueTwo)}`)
      }
    } else if (rankJ2.rank > rankJ1.rank) {
      if (rankJ2.highValueTwo === 0) {
        setResult(`J2 gagne avec ${rankJ2.figure} : ${reFormatValue(rankJ2.highValue)}`)
      } else {
        setResult(`J2 gagne avec ${rankJ2.figure} : ${reFormatValue(rankJ2.highValue)} sur ${reFormatValue(rankJ2.highValueTwo)}`)
      }
    } else {
      if (rankJ1.highValue > rankJ2.highValue) {
        if (rankJ1.highValueTwo === 0) {
          setResult(`J1 gagne avec ${rankJ1.figure} : ${reFormatValue(rankJ1.highValue)}`)
        } else {
          setResult(`J1 gagne avec ${rankJ1.figure} : ${reFormatValue(rankJ1.highValue)} sur ${reFormatValue(rankJ1.highValueTwo)}`)
        }
      } else if (rankJ2.highValue > rankJ1.highValue) {
        if (rankJ2.highValueTwo === 0) {
          setResult(`J2 gagne avec ${rankJ2.figure} : ${reFormatValue(rankJ2.highValue)}`)
        } else {
          setResult(`J2 gagne avec ${rankJ2.figure} : ${reFormatValue(rankJ2.highValue)} sur ${reFormatValue(rankJ2.highValueTwo)}`)
        }
      } else {
        let indice = 4
        while (rankJ1.hand[indice] === rankJ2.hand[indice] && indice >= 0) {
          indice--
        }
        if (rankJ1.hand[indice] > rankJ2.hand[indice]) {
          if (rankJ1.highValueTwo === 0) {
            setResult(`J1 gagne avec ${rankJ1.figure} : ${reFormatValue(rankJ1.hand[indice])}`)
          } else {
            setResult(`J1 gagne avec ${rankJ1.figure} : ${reFormatValue(rankJ1.highValue)} sur ${reFormatValue(rankJ1.highValueTwo)} avec ${reFormatValue(rankJ1.hand[indice])}`)
          }
        } else if (rankJ1.hand[indice] < rankJ2.hand[indice]) {
          if (rankJ2.highValueTwo === 0) {
            setResult(`J2 gagne avec ${rankJ2.figure} : ${reFormatValue(rankJ2.hand[indice])}`)
          } else {
            setResult(`J2 gagne avec ${rankJ2.figure} : ${reFormatValue(rankJ2.highValue)} sur ${reFormatValue(rankJ2.highValueTwo)} avec ${reFormatValue(rankJ2.hand[indice])}`)
          }
        } else {
          setResult('Egalité')
        }
      }
    }
  }


  /// CALCULATING THE HAND'S RANK
  const calculateRank = (hand) => {
    // Formatting hands
    let tabHand1 = formatHand(hand)
    let flush = hasFlush(tabHand1)
    let straight = hasStraight(tabHand1)

    let straightFlush = false

    if (straight && flush) {
      straightFlush = true
    }

    // Sorting values
    tabHand1.sort((a, b) => a - b)

    let higher = higherValue(tabHand1)

    let resSameCards = sameCards(tabHand1)

    let pair = resSameCards.pair
    let doublePair = resSameCards.doublePair
    let threeOfKind = resSameCards.threeOfKind
    let fourOfKind = resSameCards.fourOfKind
    let fullHouse = resSameCards.fullHouse

    let valueSameCards = resSameCards.valueCards
    let valueSameCardsTwo = resSameCards.valueCardsTwo
    if (resSameCards.valueCards < resSameCards.valueCardsTwo) {
      valueSameCards = resSameCards.valueCardsTwo
      valueSameCardsTwo = resSameCards.valueCards
    }

    // Calculate highest rank
    let res = {
      hand: tabHand1,
      rank: 1,
      highValue: higher,
      highValueTwo: 0,
      figure: 'high card'
    }

    if (straightFlush) {
      res = { hand: tabHand1, rank: 9, highValue: higher, highValueTwo: 0, figure: 'straight flush' }
    } else if (fourOfKind) {
      res = { hand: tabHand1, rank: 8, highValue: valueSameCards, highValueTwo: 0, figure: 'four of a kind' }
    } else if (fullHouse) {
      res = { hand: tabHand1, rank: 7, highValue: valueSameCards, highValueTwo: valueSameCardsTwo, figure: 'full house' }
    } else if (flush) {
      res = { hand: tabHand1, rank: 6, highValue: higher, highValueTwo: 0, figure: 'flush' }
    } else if (straight) {
      res = { hand: tabHand1, rank: 5, highValue: higher, highValueTwo: 0, figure: 'straight' }
    } else if (threeOfKind) {
      res = { hand: tabHand1, rank: 4, highValue: valueSameCards, highValueTwo: 0, figure: 'three of a kind' }
    } else if (doublePair) {
      res = { hand: tabHand1, rank: 3, highValue: valueSameCards, highValueTwo: valueSameCardsTwo, figure: 'two pairs' }
    } else if (pair) {
      res = { hand: tabHand1, rank: 2, highValue: valueSameCards, highValueTwo: 0, figure: 'pair' }
    }

    return res
  }


  // RETURN ORIGIN FORMAT FOR CARDS VALUE
  const reFormatValue = (value) => {
    if (value === 10) {
      return 'T'
    } else if (value === 11) {
      return 'J'
    } else if (value === 12) {
      return 'Q'
    } else if (value === 13) {
      return 'K'
    } else if (value === 14) {
      return 'A'
    } else {
      return value
    }
  }


  /// FORMATING HAND INPUT
  const formatHand = (hand) => {
    let tabHand = hand.trim().split(' ')
    tabHand.map((elem, i) => {
      if (elem === '') {
        tabHand.splice(i, 1)
      }
    })
    return tabHand
  }


  /// APP RETURN
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: 'orange',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: 45, margin: 20 }}>Outil de comparaison de mains de poker</div>
      <div style={{ fontSize: 20, margin: 20 }}>Entrer les mains de chaque joueur et cliquer sur "Comparer"</div>

      <div>Légende</div>
      <div>Trèfle : C, Pique: S, Carreau : D, Coeur : H</div>
      <div>Valeurs : 2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A</div>
      <div style={{ margin: 20 }}>Exemple de format accepté : 2H 3D 5S 9C KD</div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card style={{ display: 'flex', backgroundColor: 'grey', width: '25%', justifyContent: 'center', alignItems: 'center', paddingBottom: '15px' }}>
          <CardBody>
            <CardTitle tag='h3'>Main de poker J1</CardTitle>
            <CardText>Indiquer les cartes</CardText>
            <Input placeholder="Cartes" value={hand1} onChange={(input) => { setHand1(input.target.value) }} />
          </CardBody>
        </Card>

        <Card style={{ display: 'flex', backgroundColor: 'lightGrey', width: '25%', justifyContent: 'center', alignItems: 'center', paddingBottom: '15px' }}>
          <CardBody>
            <CardTitle tag="h3">Main de poker J2</CardTitle>
            <CardText>Indiquer les cartes</CardText>
            <Input placeholder="Cartes" value={hand2} onChange={(input) => { setHand2(input.target.value) }} />
          </CardBody>
        </Card>
      </div>

      <div style={{ margin: '10px' }}>
        <Button style={{ fontSize: 15 }} onClick={() => { handleCompare() }}>Comparer</Button>
      </div>

      {result !== '' ?
        <div>
          <div>Résultat : </div>
          <div>{result}</div>
        </div>
        :
        <div />}


    </div>
  );
}


//////// FUNCTIONS TO CALCULATE FIGURES /////////

/// FIND IF THE HAND CONTAINS SAME CARD VALUES
const sameCards = (hand) => {
  let fourOfKind = false
  let threeOfKind = false
  let pair = false
  let doublePair = false
  let fullHouse = false

  let nbCardsNow = 1
  let nbCards = 1
  let valueCardsNow = hand[0]
  let valueCards = hand[0]
  let valueCardsTwo = 0

  for (let i = 1; i < hand.length; i++) {

    if (hand[i] === hand[i - 1]) {
      nbCardsNow++
    }
    if (hand[i] > hand[i - 1] || i === hand.length - 1) {
      if (nbCardsNow > nbCards) {

        if (nbCardsNow === 4) {
          fourOfKind = true
          nbCards = nbCardsNow
          valueCards = valueCardsNow

        } else if (nbCardsNow === 3 && !pair) {
          threeOfKind = true
          nbCards = nbCardsNow
          valueCards = valueCardsNow

        } else if (nbCardsNow === 3 && pair) {
          fullHouse = true
          valueCardsTwo = valueCards
          valueCards = valueCardsNow

        } else if (nbCardsNow === 2) {
          pair = true
          nbCards = nbCardsNow
          valueCards = valueCardsNow
        }
      } else if (nbCardsNow === 2) {
        if (pair) {
          doublePair = true
          valueCardsTwo = valueCardsNow
        } else if (threeOfKind) {
          fullHouse = true
          valueCardsTwo = valueCardsNow
        }
      }
      nbCardsNow = 1
      valueCardsNow = hand[i]
    }
  }

  return { pair, doublePair, threeOfKind, fourOfKind, fullHouse, valueCards, valueCardsTwo }
}


/// FIND HIGHER CARD VALUE
const higherValue = (hand) => {
  return hand[hand.length - 1]
}

/// FIND IF THE HAND CONTAINS A STRAIGHT
const hasStraight = (hand) => {
  let straight = false
  let following = 0

  for (let i = 0; i < hand.length; i++) {
    hand[i] = hand[i].substr(0, 1)
    hand[i] = hand[i].replace('T', '10').replace('J', '11').replace('Q', '12').replace('K', '13').replace('A', '14')
    hand[i] = parseInt(hand[i])
    if (i > 0) {
      if (hand[i] === hand[i - 1] + 1) {
        following++
      }
    }
  }
  if (following === 4) {
    straight = true
  }
  return straight
}

/// FIND IF THE HAND CONTAINS A FLUSH
const hasFlush = (hand) => {
  let flush = false
  let nbH = 0
  let nbD = 0
  let nbS = 0
  let nbC = 0

  hand.map((elem, i) => {
    if (elem.includes('H')) {
      nbH++
    } else if (elem.includes('D')) {
      nbD++
    } else if (elem.includes('S')) {
      nbS++
    } else if (elem.includes('C')) {
      nbC++
    }
  })

  if (nbH === 5 || nbD === 5 || nbS === 5 || nbC === 5) {
    flush = true
  }
  return flush
}

export default App;
