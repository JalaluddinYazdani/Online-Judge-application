const express = require("express");
const { generateFile } = require("./generateFile.js");
const { generateInputFile } = require("./generateInputFile.js");
const { executeCppCode } = require("./CPP/executeCppCode.js");
const { executeCppSubmitCode } = require("./CPP/executeCppSubmitCode.js");
const { executeJavaCode } = require("./JAVA/executeJavaCode.js");
const { executeJavaSubmitCode } = require("./JAVA/executeJavaSubmitCode.js");
const { executePyCode } = require("./Python/executePyCode.js");
const { executePySubmitCode } = require("./Python/executePySubmitCode.js");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const app = express();
const corsOptions = {
  origin: [FRONTEND_URL,"http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello from Compiler");
});

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;
  if (code === undefined) {
    return res
      .status(404)
      .json({ success: false, message: "Please Enter your code" });
  }
  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    if (language === "cpp") {
      const output = await executeCppCode(filePath, inputPath);
      return res.status(200).json({ success: true, output });
    }
    if (language === "java") {
      const output = await executeJavaCode(filePath, inputPath);
      return res.status(200).json({ success: true, output });
    }
    if (language === "py") {
      const output = await executePyCode(filePath, inputPath);
      return res.status(200).json({ success: true, output });
    }
    return res
      .status(400)
      .json({ success: false, message: "please enter the correct language" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/submit", async (req, res) => {
  const { language = "cpp", code, inputTestcases, outputTestcases } = req.body;
  if (code === "") {
    return res
      .status(404)
      .json({ success: false, message: "Please Enter your code" });
  }
  try {
    const filePath = await generateFile(language, code);
    if (language === "cpp") {
      const output = await executeCppSubmitCode(
        filePath,
        inputTestcases,
        outputTestcases
      );
      return res.status(200).json({ success: true, output });
    }
    if (language === "java") {
      const output = await executeJavaSubmitCode(
        filePath,
        inputTestcases,
        outputTestcases
      );
      return res.status(200).json({ success: true, output });
    }
    if (language === "py") {
      const output = await executePySubmitCode(
        filePath,
        inputTestcases,
        outputTestcases
      );
      return res.status(200).json({ success: true, output });
    }
    return res
      .status(400)
      .json({ success: false, message: "please enter the correct language" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});