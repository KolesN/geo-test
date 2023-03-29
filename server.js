import express from 'express'

import * as turf from '@turf/turf'

import { readFile, writeFile } from './controller/filesController.js'
import { getAll } from './controller/db.js'

const port = process.env.PORT || 8090
const app = express()

// const connection = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'shop'
// }).promise()

const checkPoint = (userLocation, area) => turf.booleanPointInPolygon(userLocation, area)

const table = 'product'

const query = await getAll()

app.use(express.json())

// connection.connect((err) => {
//   if (err) {
//     console.log('Error occured', err)
//   }
// })

app.get('/table', async (req, res) => {
  res.json(query)
})

app.post('/table/:id', async (req, res) => {
  const data = await readFile('data.json')
  const userId = +req.params.id - 1

  const nextIndex = data[data.length - 1].id + 1
  const newItem = { ...data[userId], id: nextIndex }

  connection.query('INSERT INTO ?? SET ?', [table, newItem], (...args) => {
    console.log('There args', args)
  })

  res.json({
    message: 'Added'
  })
})

app.get('/areas', async (req, res) => {
  const areas = await readFile('areas.json')
  res.json(areas
    .map(({ area }) => (area))
    .map(({ geometry }) => geometry))

})

app.get('/areas/:number', async (req, res) => {
  const id = +req.params.number
  const areas = await readFile('areas.json')
  const area = areas.filter((item, index) => index === id)
  res.json(area)
})

app.get('/users', async (req, res) => {
  const users = await readFile('users.json')
  res.json(users
    .map(({ location }) => (location)))

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