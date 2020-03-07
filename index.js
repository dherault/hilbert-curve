const halfPi = Math.PI / 2
const canvas = document.getElementsByTagName('canvas')[0]
const _ = canvas.getContext('2d')

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight
const size = Math.min(width, height)

let degree = 4

_.fillStyle = 'white'
_.strokeStyle = 'black'

function draw() {
  _.clearRect(0, 0, width, height)
  _.beginPath()
  createHilbertCurve(degree)(width / 2, height / 2, size)
  _.stroke()
}

function createHilbertCurve(maxDepth = 1) {

  function createCurveHyperParameters(size, rotation, invert) {
    const s = size / 2
    const z = s / 2
    const rotationXorInvert = rotation && !invert || !rotation && invert

    const hyperParameters = [
      [-z, z, s, halfPi, rotationXorInvert],
      [-z, -z, s, 0, rotationXorInvert],
      [z, -z, s, 0, rotationXorInvert],
      [z, z, s, -halfPi, rotationXorInvert],
    ]

    return rotationXorInvert ? hyperParameters.reverse() : hyperParameters
  }

  function drawCurve(x, y, size, rotation = 0, invert = false) {
    _.save()
    _.translate(x, y)
    _.rotate(rotation)

    createCurveHyperParameters(size, rotation, invert).forEach(hyperParameter => {
      _.lineTo(...hyperParameter)
    })

    _.restore()
  }

  function drawPart(x, y, size, rotation = 0, invert = false, depth = 1) {
    _.save()
    _.translate(x, y)
    _.rotate(rotation)

    const fn = depth === maxDepth ? drawCurve : drawPart
    const lastArg = depth === maxDepth ? undefined : depth + 1

    createCurveHyperParameters(size, rotation, invert).forEach(hyperParameter => {
      fn(...hyperParameter, lastArg)
    })

    _.restore()
  }

  return drawPart
}

const plusButton = document.getElementById('plus')
const minusButton = document.getElementById('minus')
const degreeSpan = document.getElementById('degree')

plusButton.onclick = () => {
  degree++
  step()
}

minusButton.onclick = () => {
  degree = Math.max(1, degree - 1)
  step()
}

function updateUi() {
  degreeSpan.innerHTML = degree
}

function step() {
  updateUi()
  draw()
}

window.addEventListener('load', step)
