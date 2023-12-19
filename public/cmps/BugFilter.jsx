import { bugService } from "../services/bug.service.js"
const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function onSetFilterBy(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value
    console.log("value:", value)

    switch (target.type) {
      case "number":
      case "range":
        value = +value
        break

      case "checkbox":
        value = target.checked
        break

      case "select-one":
        // Handle select dropdown
        value = target.value
        break

      default:
        break
    }

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  const labelsArray = bugService.getLabels()

  const { txt, severity, label, sortBy } = filterByToEdit
  return (
    <section className="car-filter main-layout full">
      <h2>Filter Our Bugs</h2>
      <form onSubmit={onSetFilterBy}>
        <label htmlFor="txt">Title: </label>
        <input
          value={txt}
          onChange={handleChange}
          type="text"
          id="txt"
          name="txt"
        />

        <label htmlFor="label">label: </label>
        <select name="label" id="" value={label} onChange={handleChange}>
          {labelsArray.map((label) => {
            return (
              <option key={label} value={label}>
                {label}
              </option>
            )
          })}
          {/* <option value="TEST">TEST</option>
          <option value="b">b</option>
          <option value="c">c</option>
          <option value="d">d</option> */}
        </select>

        <label htmlFor="severity">minSeverity: </label>
        <input
          value={severity || ""}
          onChange={handleChange}
          type="number"
          id="severity"
          name="severity"
        />

        <label htmlFor="sortBy">sortBy:</label>
        <select
          name="sortBy"
          id="sortBy"
          onChange={handleChange}
          value={sortBy || ""}
        >
          <option value="">select</option>
          <option value="title">title</option>
          <option value="severity">severity </option>
          <option value="createdAt">date</option>
        </select>

        <button>Submit</button>
      </form>
    </section>
  )
}
