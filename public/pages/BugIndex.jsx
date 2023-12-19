import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { BugFilter } from "../cmps/BugFilter.jsx"

const { useState, useEffect } = React

export function BugIndex() {
  const [bugs, setBugs] = useState(null)
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  useEffect(() => {
    loadBugs()
  }, [])

  function loadBugs() {
    bugService
      .query(filterBy)
      .then(setBugs)
      .catch((err) => console.log("err:", err))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log("Deleted Succesfully!")
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
        setBugs(bugsToUpdate)
        showSuccessMsg("Bug removed")
      })
      .catch((err) => {
        console.log("Error from onRemoveBug ->", err)
        showErrorMsg("Cannot remove bug")
      })
  }

  function onSetFilter(filterBy) {
    // setFilterBy(filterBy)
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
  }

  function onAddBug() {
    const bug = {
      title: prompt("Bug title?"),
      severity: +prompt("Bug severity?"),
      description: prompt(" enter a description")
    }
    bugService
      .save(bug)
      .then((savedBug) => {
        console.log("Added Bug", savedBug)
        setBugs([...bugs, savedBug])
        showSuccessMsg("Bug added")
      })
      .catch((err) => {
        console.log("Error from onAddBug ->", err)
        showErrorMsg("Cannot add bug")
      })
  }

  function onEditBug(bug) {
    const severity = +prompt("New severity?")
    const bugToSave = { ...bug, severity }
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        console.log("Updated Bug:", savedBug)
        const bugsToUpdate = bugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
        setBugs(bugsToUpdate)
        showSuccessMsg("Bug updated")
      })
      .catch((err) => {
        console.log("Error from onEditBug ->", err)
        showErrorMsg("Cannot update bug")
      })
  }

  const { txt, severity } = filterBy

  if (!bugs) return <div>Loading...</div>
  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugFilter
          filteter
          filterBy={{ txt, severity }}
          onSetFilter={onSetFilter}
        />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}