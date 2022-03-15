// import styles
import '@/styles/index.scss'

import { UI } from '@/js/UI'
import { Prediction } from './js/Prediction'

import camConfig from '@/js/CameraConfig'

var playerVideo

var playerScore = 0,
  computerScore = 0

async function onInit() {
  UI.init()
  UI.setStatusMessage('Initializing - Please wait a moment')

  const videoPromise = UI.initPlayerVideo(camConfig)
  const predictPromise = Prediction.init()

  console.log('Initialize game...')

  Promise.all([videoPromise, predictPromise]).then((result) => {
    playerVideo = result[0]
    playerVideo.play()

    console.log('Initialization finished')

    waitForPlayer()
  })
}
//-----

function waitForPlayer() {
  if (UI.isMobile()) {
    UI.setStatusMessage('Touch the screen to start')
  } else {
    UI.setStatusMessage('Press any key to start')
  }

  UI.startAnimateMessage()

  const startGame = () => {
    UI.stopAnimateMessage()
    playOneRound()
  }

  if (UI.isMobile()) {
    document.addEventListener('touchstart', startGame, { once: true })
  } else {
    window.addEventListener('keypress', startGame, { once: true })
  }
}

async function playOneRound() {
  UI.showRobotImage(true)

  UI.showTimer(false)
  UI.setTimerProgress(0)
  UI.setPlayerHand('')

  await UI.startCountdown()

  UI.showTimer(true)

  detectPlayerGesture(150)
}

function detectPlayerGesture(requiredDuration) {
  let lastGesture = ''
  let gestureDuration = 0

  const predictNonblocking = () => {
    setTimeout(() => {
      const predictionStartTS = Date.now()

      Prediction.predictGesture(playerVideo, 9).then((playerGesture) => {
        if (playerGesture != '') {
          if (playerGesture == lastGesture) {
            const deltaTime = Date.now() - predictionStartTS
            gestureDuration += deltaTime
          } else {
            UI.setPlayerHand(playerGesture)
            lastGesture = playerGesture
            gestureDuration = 0
          }
        } else {
          UI.setPlayerHand(false)
          lastGesture = ''
          gestureDuration = 0
        }

        if (gestureDuration < requiredDuration) {
          UI.setTimerProgress(gestureDuration / requiredDuration)
          predictNonblocking()
        } else {
          // player result available
          // -> stop timer and check winner
          UI.setTimerProgress(1)
          UI.animatePlayerHand()

          const computerGesture = getRandomGesture()

          checkResult(playerGesture, computerGesture)
        }
      })
    }, 0)
  }

  predictNonblocking()
}

function checkResult(playerGesture, computerGesture) {
  let statusText
  let playerWins = false
  let computerWins = false

  if (playerGesture == computerGesture) {
    // draw
    statusText = "It's a draw!"
  } else {
    if (playerGesture == 'rock') {
      if (computerGesture == 'scissors') {
        playerWins = true
        statusText = 'Rock beats scissors'
      } else {
        computerWins = true
        statusText = 'Paper beats rock'
      }
    } else if (playerGesture == 'paper') {
      if (computerGesture == 'rock') {
        playerWins = true
        statusText = 'Paper beats rock'
      } else {
        computerWins = true
        statusText = 'Scissors beat paper'
      }
    } else if (playerGesture == 'scissors') {
      if (computerGesture == 'paper') {
        playerWins = true
        statusText = 'Scissors beat paper'
      } else {
        computerWins = true
        statusText = 'Rock beats scissors'
      }
    }
  }

  if (playerWins) {
    playerScore++
    statusText += ' - You win!'
  } else if (computerWins) {
    computerScore++
    statusText += ' - The robot wins!'
  }

  UI.showRobotHand(true)
  UI.setRobotGesture(computerGesture)

  UI.setStatusMessage(statusText)

  UI.setPlayerScore(playerScore)
  UI.setRobotScore(computerScore)

  setTimeout(playOneRound, 3000)
}

function getRandomGesture() {
  const gestures = ['rock', 'paper', 'scissors']
  const randomNum = Math.floor(Math.random() * gestures.length)
  return gestures[randomNum]
}
//-----

onInit()
