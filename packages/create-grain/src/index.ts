
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_NAME = 'vite';

async function resolveTargetDirectory(projectDirectory?: string): Promise<string> {
  if (projectDirectory) {
    return projectDirectory;
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectDirectory',
      message: 'What is your project named?',
      default: 'my-grain-app'
    }
  ]);

  return answers.projectDirectory;
}

async function resolveTemplate(template?: string): Promise<string> {
  if (template) {
    return template;
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { name: 'Vite (Vanilla + Web Components)', value: TEMPLATE_NAME }
      ]
    }
  ]);

  return answers.template;
}

async function scaffoldProject(targetDir: string, template: string): Promise<void> {
  if (template !== TEMPLATE_NAME) {
    throw new Error(`Unsupported template "${template}". Available templates: ${TEMPLATE_NAME}`);
  }

  const targetPath = path.resolve(process.cwd(), targetDir);
  const templateDir = path.resolve(__dirname, '../templates', template);

  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  await fs.ensureDir(targetPath);
  await fs.copy(templateDir, targetPath);

  const packageJsonPath = path.join(targetPath, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJSON(packageJsonPath);
    packageJson.name = targetDir;
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
  }
}

program
  .name('create-grain-app')
  .description('Scaffold a new Grain application')
  .argument('[project-directory]', 'Directory to create the project in')
  .option('-t, --template <type>', `Template to use (${TEMPLATE_NAME})`)
  .action(async (projectDirectory, options) => {
    console.log(chalk.cyan.bold('\nWelcome to Grain.\n'));

    try {
      const targetDir = await resolveTargetDirectory(projectDirectory);
      const template = await resolveTemplate(options.template);

      console.log(`Creating a new Grain app in ${chalk.green(path.resolve(process.cwd(), targetDir))}...`);
      await scaffoldProject(targetDir, template);

      console.log(chalk.green('\nSuccess. Created your app.\n'));
      console.log(chalk.cyan(`  cd ${targetDir}`));
      console.log(chalk.cyan('  npm install'));
      console.log(chalk.cyan('  npm run dev'));
      console.log('');
    } catch (error) {
      console.error(chalk.red(error instanceof Error ? error.message : 'Failed to create project'));
      process.exit(1);
    }
  });

program.parse();
