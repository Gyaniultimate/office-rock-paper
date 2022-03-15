import * as handpose from '@tensorflow-models/handpose'

import '@tensorflow/tfjs-backend-webgl'

import { GestureEstimator } from 'fingerpose'
import { RockGesture, PaperGesture, ScissorsGesture } from './Gestures'

import { SampleImage } from './SampleImage'

let handposeModel
let gestureEstimator

export const Prediction = {
  async init() {
    const knownGestures = [RockGesture, PaperGesture, ScissorsGesture]
    gestureEstimator = new GestureEstimator(knownGestures)
    console.log('Initialized FingerPose with ' + knownGestures.length + ' gestures')

    console.log('Loading handpose model...')
    handposeModel = await handpose.load()
    console.log('Model loaded')

    console.log('Warm up model')
    const sample = await SampleImage.create()
    await handposeModel.estimateHands(sample, false)
    console.log('Model is hot!')
  },

  async predictGesture(sourceElement, minimumScore) {
    const predictions = await handposeModel.estimateHands(sourceElement, false)

    if (predictions.length > 0) {
      const gestureEstimations = gestureEstimator.estimate(predictions[0].landmarks, minimumScore)

      if (gestureEstimations.gestures.length > 0) {
        const gestureResult = gestureEstimations.gestures.reduce((p, c) =>
          p.confidence > c.confidence ? p : c
        )

        return gestureResult.name
      }
    }

    return ''
  },
}
