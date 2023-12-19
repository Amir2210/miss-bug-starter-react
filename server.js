import express, { query } from "express"
import { bugService } from "./service/bug.service.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())

// if someone go to /nono its will redirect him to /
app.get("/nono", (req, res) => res.redirect("/"))

// Get Bugs (READ)
app.get("/api/bug", (req, res) => {
  console.log("req.query:", req.query)
  const filterBy = {
    txt: req.query.txt || "",
    severity: req.query.severity || 0,
    pageIdx: req.query.pageIdx,
    label: req.query.label
  }
  console.log("filterBy:", filterBy)
  bugService
    .query(filterBy)
    .then((bugs) => {
      res.send(bugs)
    })
    .catch((err) => {
      loggerService.error("Cannot get bugs", err)
      res.status(400).send("Cannot get bugs")
    })
})

// Add Bug (Create)
app.post("/api/bug", (req, res) => {
  console.log("req.body:", req.body)
  const bugToSave = {
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity,
    createdAt: Date.now()
  }

  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error("Cannot save bug", err)
      res.status(400).send("Cannot save bug")
    })
})

// Edit Bug (UPDATE)
app.put("/api/bug", (req, res) => {
  console.log("req.body:", req.body)
  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity,
    createdAt: 1542107359454
  }

  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error("Cannot save bug", err)
      res.status(400).send("Cannot save bug")
    })
})

app.get("/api/bug/:id", (req, res) => {
  const bugId = req.params.id
  const { visitCountMap = [] } = req.cookies
  console.log("visitCountMap:", visitCountMap)
  if (visitCountMap.length >= 3) return res.status(401).send("faild to get bug")
  if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)
  res.cookie("visitCountMap", visitCountMap, { maxAge: 1000 * 999 })

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error("Cannot get bug", err)
      res.status(400).send("Cannot get bug")
    })
})

// Remove Bug (DELETE)
app.delete("/api/bug/:id", (req, res) => {
  const bugId = req.params.id
  console.log("dlt bugid:", bugId)
  bugService
    .remove(bugId)
    .then(() => res.send(bugId))
    .catch((err) => {
      loggerService.error("Cannot remove bug", err)
      res.status(400).send("Cannot remove bug")
    })
})

const port = 3030
app.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:${port}/`)
)
