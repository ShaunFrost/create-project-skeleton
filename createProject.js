import inquirer from "inquirer";
import fs from "fs";
import { CREATE_VITE_TEMPLATE, EMPTY_TEMPLATES, USER_PROMPTS } from "./userPrompts.js";
import { __dirname } from "./fileUtils.js";
import { exec } from "child_process";

const CURR_DIR = process.cwd();

inquirer.prompt(USER_PROMPTS).then((answers) => {
  const templateType = answers["template"];
  const projectName = answers["project-name"];
  if (templateType.startsWith("Empty")) {
    //get from templates
    const templatePath = `${__dirname}/templates/${EMPTY_TEMPLATES[templateType]}`;

    if (projectName !== ".") {
      fs.mkdirSync(`${CURR_DIR}/${projectName}`);
    }

    const writeDirectory =
      projectName === "." ? CURR_DIR : `${CURR_DIR}/${projectName}`;

    createDirectoryContents(templatePath, writeDirectory, projectName);
  } else {
    exec(
      `npm create vite@latest ${projectName} -- --template ${CREATE_VITE_TEMPLATE[templateType]}`,
      (err, stdout) => {
        if (err) {
          console.log(err);
        }
        console.log(stdout);
      }
    );
  }
});

function createDirectoryContents(templatePath, writeDirectory, projectName) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const writePath = `${writeDirectory}/${file}`;
      const content = fs.readFileSync(origFilePath, "utf8");
      if (file === 'package.json') {
        const packageJson = JSON.parse(content)
        packageJson.name = projectName === '.' ? CURR_DIR.substring(CURR_DIR.lastIndexOf('/')+1) : projectName
        fs.writeFileSync(writePath, JSON.stringify(packageJson, null, 2), "utf8");
      } else {
        fs.writeFileSync(writePath, content, "utf8");
      }
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${writeDirectory}/${file}`);

      // recursive call
      createDirectoryContents(
        `${templatePath}/${file}`,
        `${writeDirectory}/${file}`,
        projectName
      );
    }
  });
}
