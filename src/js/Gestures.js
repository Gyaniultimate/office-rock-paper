import { GestureDescription, Finger, FingerCurl } from 'fingerpose'

const RockGesture = new GestureDescription('rock')
const PaperGesture = new GestureDescription('paper')
const ScissorsGesture = new GestureDescription('scissors')

RockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
RockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5)

for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  RockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0)
  RockGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9)
}

for (let finger of Finger.all) {
  PaperGesture.addCurl(finger, FingerCurl.NoCurl, 1.0)
}

ScissorsGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
ScissorsGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)

ScissorsGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0)
ScissorsGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9)

ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0)
ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9)

export { RockGesture, PaperGesture, ScissorsGesture }
