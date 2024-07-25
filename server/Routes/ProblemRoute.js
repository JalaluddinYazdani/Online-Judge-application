const {
    problems,
    addProblem,
    getProblem,
    updateProblem,
    filterProblem,
    deleteProblem,
    addSubmission,
  } = require("../Controllers/ProblemContoller.js");
  const router = require("express").Router();
  router.get("/", problems);
  router.post("/", addProblem);
  router.get("/:id", getProblem);
  router.put("/:id", updateProblem);
  router.get("/diff/:diff", filterProblem);
  router.delete("/:id", deleteProblem);
  router.post('/:problemId/:userId',addSubmission);
  module.exports = router;