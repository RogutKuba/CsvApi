import { exec } from "child_process";

const runFile = async () => {
  // Extract the filename argument passed from the command line
  const filename = process.argv[2];

  if (!filename) {
    console.error("Please provide a filename.");
    process.exit(1);
  }

  // Run the specified file
  console.log(`Running script with filename: ${filename}`);

  const filePath = `dist/scripts/${filename}.js`;
  exec(`node ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running the script: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Script execution returned an error: ${stderr}`);
      return;
    }
    console.log(`Script output:\n${stdout}`);
  });
};

runFile();

export {};
