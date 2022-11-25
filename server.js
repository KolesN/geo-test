const express = require('express')
const fs = require('fs').promises
const path = require('path')
const turf = require('@turf/turf')

const port = process.env.PORT || 8090
const app = express()

const checkPoint = (userLocation, area) => turf.booleanPointInPolygon(userLocation, area)

const readFile = async (filename) => {
  return await fs.readFile(path.resolve(__dirname, `${filename}`), { encoding: 'utf8' })
    .then(( data ) => JSON.parse(data))
    .catch(err => console.log(err))

}

const writeFile = async (filename, text) => {
  return await fs.writeFile(path.resolve(__dirname, `${filename}`), text, { encoding: 'utf8' })
  .catch(err => console.log(err))
}

app.use(express.json())

app.get('/areas', async (req, res) => {
  const areas = await readFile('areas.json')
  res.json(areas.map(({ area }) => (area)))
})

app.get('/areas/:number', async (req, res) => {
  const id = +req.params.number
  const areas = await readFile('areas.json')
  const area = areas.filter((item, index) => index === id)
  res.json(area)
})

app.get('/users', async (req, res) => {
  const users = await readFile('users.json')
  res.json(users.map(({ location }) => (location)))
})

app.get('/users/:id', async (req, res) => {
  const id = +req.params.id
  const users = await readFile('users.json')
  const user = users.filter((item) => item.id === id)
  res.json(user)
})

//If user changes location
app.post('/users/:id', async (req, res) => {
  const users = await readFile('users.json')
  const areas = await readFile('areas.json')

  const newLocation = req.body
  const userId = +req.params.id

  const updatedUsers = users.reduce((acc, rec) => {
    if (rec.id === userId) {
      const prevAreas = rec.prevAreas.concat(rec.currentAreas).filter((item, index, array) => array.indexOf(item) === index)

      const currentAreas = areas
      .filter(item => checkPoint(newLocation, item.area))
      .map(({ name }) => name)

      const updatedUser = { ...rec, currentAreas, prevAreas}
      return [...acc, updatedUser]
    }

    return [...acc, rec]
  }, [])

  const result = await writeFile('users.json', JSON.stringify(updatedUsers))

  res.json({
    message: 'Done'
  })
})


//Initializing users current areas
app.get('/init', async (req, res) => {
  const users = await readFile('users.json')
  const areas = await readFile('areas.json')

  const updatedUsers = users.reduce((acc, rec) => {

    const prevAreas = rec.prevAreas.concat(rec.currentAreas).filter((item, index, array) => array.indexOf(item) === index)

    const currentAreas = areas
      .filter(item => checkPoint(rec.location, item.area))
      .map(({ name }) => name)

    const updatedUser = { ...rec, currentAreas, prevAreas}
    return [...acc, updatedUser]
  }, [])

  const result = await writeFile('users.json', JSON.stringify(updatedUsers))

  res.json({
    message: 'Done'
  })
})


app.listen(port, () => {
  console.log(`Serving at ${port}`)
})