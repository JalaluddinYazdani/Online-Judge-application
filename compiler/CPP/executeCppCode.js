const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const executeCppCode = async (filePath, inputPath) => {
  const outputPath = path.join(__dirname, "../Outputs");
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const process = exec(
      `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe < ${inputPath}`,
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
    }, 1000);
  });
};
module.exports = { executeCppCode };