import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"

const STORAGE_KEY = "bugDB"
const BASE_URL = "/api/bug/"
_createBugs()

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter
}

function query(filterBy) {
  console.log("filterBy:", filterBy)
  return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data)
  // .then((bugs) => {
  //   if (filterBy.txt) {
  //     const regExp = new RegExp(filterBy.txt, "i")
  //     bugs = bugs.filter((bug) => regExp.test(bug.title))
  //   }
  //   if (filterBy.severity) {
  //     bugs = bugs.filter((bug) => bug.severity >= filterBy.severity)
  //   }
  //   return bugs
  // })
}
function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data)
  //   return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then((res) => res.data)
  //   return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  const url = BASE_URL + "save"
  // let queryParams = `?title=${bug.title}&description=${bug.description}&severity${bug.severity}&createdAt=${bug.createdAt}`
  // if (bug._id) queryParams += `&_id=${bug._id}`
  // return axios.get(url + queryParams)
  if (bug._id) {
    return axios.put(BASE_URL, bug).then((res) => res.data)
  } else {
    return axios.post(BASE_URL, bug).then((res) => res.data)
  }
}

function getDefaultFilter() {
  return { txt: "", severity: 0, pageIdx: 0 }
}

function _createBugs() {
  let bugs = utilService.loadFromStorage(STORAGE_KEY)
  if (!bugs || !bugs.length) {
    bugs = [
      {
        title: "Infinite Loop Detected",
        severity: 4,
        _id: "1NF1N1T3"
      },
      {
        title: "Keyboard Not Found",
        severity: 3,
        _id: "K3YB0RD"
      },
      {
        title: "404 Coffee Not Found",
        severity: 2,
        _id: "C0FF33"
      },
      {
        title: "Unexpected Response",
        severity: 1,
        _id: "G0053"
      }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
  }
}
