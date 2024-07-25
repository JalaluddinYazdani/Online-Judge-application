const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const executeJavaCode = async (filePath, inputPath) => {
  const outputPath = path.join(__dirname, "../Outputs");
  const codePath = path.dirname(filePath);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  const jobId = path.basename(filePath).split(".")[0];
  return new Promise((resolve, reject) => {
    const process = exec(
      `javac ${filePath} -d ${outputPath} && cd ${codePath} && java ${jobId}.java < ${inputPath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
    setTimeout(() => {
      process.kill();
      reject(new Error("TLE,  process terminated"));
    }, 2000);
  });
};
module.exports = { executeJavaCode };