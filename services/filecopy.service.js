import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const copyFileSync = (source, target) => {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

export const copyFolderSync = (source, target) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  fs.readdirSync(source).forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyFolderSync(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  });
};

export const getCurrentFolder = (name) => {
  const result = name.split("/");

  if (Array.isArray(result) && result.length > 0) return result.pop();
  else return name;
};

export const generateProject = (modulePath, toGeneratePath) => {
  // to get __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // copy template files and folders
  const templatePath = path.join(__dirname, "../templates/" + modulePath);

  // generate module folder
  const moduleName = getCurrentFolder(modulePath);
  const newPathToGenerate = toGeneratePath + "/" + moduleName;

  // create module name if not created
  if (fs.existsSync(newPathToGenerate)) throw new Error("Module already exist");
  fs.mkdirSync(newPathToGenerate, { recursive: true });

  // copy module to your dir
  copyFolderSync(templatePath, newPathToGenerate);

  console.log("Module generated successfully!");
};
