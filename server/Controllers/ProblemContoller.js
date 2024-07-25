const problems = require("../Model/Problems.js");
const User = require("../Model/User.js");

module.exports.problems = async (req, res, next) => {
  try {
    const allProblems = await problems.find();
    if (allProblems.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "There is no problem list" });
    }
    res.status(200).json({ success: true, allProblems });
    next();
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "Failed to fetch the problems" });
  }
};
module.exports.addProblem = async (req, res, next) => {
  try {
    const {
      title,
      statement,
      difficulty,
      inputConstraints,
      sampleInput,
      outputConstraints,
      sampleOutput,
      testcasesInput,
      testcasesOutput,
    } = req.body;
    if (!(title && statement && difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the required fields",
      });
    }
    const problem = await problems.create({
      title,
      statement,
      difficulty,
      input: {
        constraints: inputConstraints,
        sample: sampleInput,
      },
      output: {
        constraints: outputConstraints,
        sample: sampleOutput,
      },
      testcases: {
        input: testcasesInput,
        output: testcasesOutput,
      },
    });
    res.status(201).json({ success: true, message: "problem added", problem });
    next();
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "Failed to add the problems" });
  }
};
module.exports.getProblem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const problem = await problems.findById(id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, problem });
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
module.exports.updateProblem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const upProblem = await problems.findById(id);
    const updatedProblem = await problems.findByIdAndUpdate(id, {
      title: req.body.title || upProblem.title,
      statement: req.body.statement || upProblem.statement,
      difficulty: req.body.difficulty || upProblem.difficulty,
      input: {
        constraints: req.body.inputConstraints || upProblem.input.constraints,
        sample: req.body.sampleInput || upProblem.input.sample,
      },
      output: {
        constraints: req.body.outputConstraints || upProblem.output.constraints,
        sample: req.body.sampleOutput || upProblem.output.sample,
      },
      testcases: {
        input: req.body.testcasesInput || upProblem.testcases.input,
        output: req.body.testcasesOutput || upProblem.testcases.output,
      },
    });
    if (!updatedProblem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    res.status(201).json({ success: true, message: "Problem get Updated" });
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
module.exports.filterProblem = async (req, res, next) => {
  try {
    const diff = req.params.diff;
    const allProblems = await problems.find({ difficulty: diff });
    if (!allProblems) {
      return res.status(404).json({
        success: false,
        message: "This difficulty problem is not found",
      });
    }
    res.status(200).json({ success: true, allProblems });
    next();
  } catch (error) {
    return res.status(400).json({ success: true, message: error.message });
  }
};
module.exports.deleteProblem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedProblem = await problems.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, message: "Problem gets deleted" });
    next();
  } catch (error) {
    return res.statu(400).json({ success: false, message: error.message });
  }
};
module.exports.addSubmission = async (req, res, next) => {
  const problemId = req.params.problemId;
  const userId = req.params.userId;
  const { language, solution, verdict, timeTaken } = req.body;

  try {
    const problem = await problems.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }
    // console.log(problem);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const problemTitle = problem.title;
    const firstname = user.firstname;
    const lastname = user.lastname;
    const problemSubmission = {
      userId,
      firstname,
      lastname,
      language,
      solution,
      verdict,
      timeTaken,
    };
    const userSubmission = {
      problemId,
      problemTitle,
      language,
      verdict,
      timeTaken,
    };
    // console.log(user);
    problem.submissions.push(problemSubmission);
    await problem.save();
    user.submissions.push(userSubmission);
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "Submission added successfully" });
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};