

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
    .name('create-grain-app')
    .description('Scaffold a new Grain AI application')
    .argument('[project-directory]', 'Directory to create the project in')
    .option('-t, --template <type>', 'Template to use (react, next, vanilla)')
    .action(async (projectDirectory, options) => {
        console.log(chalk.cyan.bold('\nWelcome to Grain! The Universal AI Interaction Layer.\n'));

        let targetDir = projectDirectory;
        let template = options.template;

        if (!targetDir) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'projectDirectory',
                    message: 'What is your project named?',
                    default: 'my-grain-app'
                }
            ]);
            targetDir = answers.projectDirectory;
        }

        if (!template) {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'template',
                    message: 'Which template would you like to use?',
                    choices: [
                        { name: 'Next.js (React)', value: 'nextjs' },
                        { name: 'Vite (Vanilla + Web Components)', value: 'vite' }
                    ]
                }
            ]);
            template = answers.template;
        }

        const targetPath = path.resolve(process.cwd(), targetDir);

        console.log(`\nCreating a new Grain app in ${chalk.green(targetPath)}...`);

        // Ensure the directory exists
        await fs.ensureDir(targetPath);

        // Copy template files
        const templateDir = path.resolve(__dirname, '../templates', template);

        try {
            if (await fs.pathExists(templateDir)) {
                await fs.copy(templateDir, targetPath);
            } else {
                // Temporary fallback if templates don't exist yet
                await fs.writeJSON(path.join(targetPath, 'package.json'), {
                    name: targetDir,
                    version: '0.1.0',
                    private: true,
                    dependencies: {
                        grain: "latest",
                        "@grain.sh/web": "latest",
                        ...(template === 'nextjs' ? { "next": "latest", "react": "latest", "react-dom": "latest", "@grain.sh/react": "latest" } : {})
                    }
                }, { spaces: 2 });
            }
        } catch (err) {
            console.error(chalk.red('Failed to copy template files:'), err);
            process.exit(1);
        }

        console.log(chalk.green('\nSuccess! Created your app.'));
        console.log('\nInside that directory, you can run several commands:\n');
        console.log(chalk.cyan('  npm install'));
        console.log('    Installs the dependencies.\n');
        console.log(chalk.cyan('  npm run dev'));
        console.log('    Starts the development server.\n');

        console.log('We suggest that you begin by typing:\n');
        console.log(chalk.cyan(`  cd ${targetDir}`));
        console.log(chalk.cyan('  npm install'));
        console.log(chalk.cyan('  npm run dev'));
        console.log('\n');
    });

program.parse();
