#!/usr/bin/env node

import path from "path";
import { program } from "commander";

import { generateProject } from "../services/filecopy.service.js";

program
  .command("gen <modulePath>")
  .description("Generate a module project")
  .option(
    "-p, --path <path>",
    "The path where the component will get generated in."
  )
  .action((modulePath, options) => {
    // options
    const externalPath = options?.path;

    const currentDir = path.join(process.cwd(), externalPath || "");

    generateProject(modulePath, currentDir);
  });

program.parse(process.argv);
