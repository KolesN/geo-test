const turf = require('@turf/turf')
const fs = require('fs')

const latitude = 38.4170
const longitude = 27.1339
const scale = 0.03
const areaRadius = 50

const mainArea = {
  name: 'mainArea',
  area: turf.ellipse([longitude, latitude], 3, 3)
}

const staticUser = {
  id: 0,
  location: turf.point([longitude, latitude]),
  currentAreas: ['mainArea'],
  prevAreas: []
}

// This is for random point generation

const getPoint = (scale, xAxis = 0, yAxis = 0) => {
  const axisPoint = (startPoint = 0) => (Math.random() - 1) * scale + startPoint

  if (!xAxis && !yAxis) {
    return axisPoint()
  }

  return [axisPoint(xAxis), axisPoint(yAxis)]
}

const errorHandler = (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Success')
}

// This function is for random areas generation

const geoAreas =  Array(13).fill({}).map((item, index) => {
  const center = getPoint(scale, longitude, latitude)
  getPoint(scale * areaRadius)
  return item = {
    name: `Area ${index + 1}`,
    area: turf.ellipse(center, getPoint(scale * areaRadius), getPoint(scale * areaRadius))
  }
})

//This is for random users generation

const geoUsers = Array(10).fill({}).map((item, index) => {
  return item = {
    id: index + 1,
    location: turf.point(getPoint(scale, longitude, latitude)),
    currentAreas: [],
    prevAreas: [],
  }
})


fs.writeFile('./areas.json', JSON.stringify([...geoAreas, mainArea]), errorHandler)
fs.writeFile('./users.json', JSON.stringify([staticUser, ...geoUsers]), errorHandler)
