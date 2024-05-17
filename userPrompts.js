import fs from 'fs'
import { __dirname } from './fileUtils.js'

// const TEMPLATES = fs.readdirSync(`${__dirname}/templates`);

const TEMPLATES = ['Empty Vite + React + Typescript', 'Empty Vite + React + Typescript + Tailwind', 'Vite + React + Typescript', 'Vite + React']

export const CREATE_VITE_TEMPLATE = {
  'Vite + React + Typescript': 'react-ts',
  'Vite + React': 'react'
}

export const EMPTY_TEMPLATES = {
  'Empty Vite + React + Typescript': 'vite-react-typescript',
  'Empty Vite + React + Typescript + Tailwind': 'vite-react-typescript-tailwind'
}

export const USER_PROMPTS = [
    {
      name: 'template',
      type: 'list',
      message: 'What project template would you like to generate?',
      choices: TEMPLATES
    },
    {
      name: 'project-name',
      type: 'input',
      message: 'Project name: (Use . for using the current directory)',
      validate: function (input) {
        if (input === '.') return true
        if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
        else return 'Project name may only include letters, numbers, underscores and hashes.';
      }
    }
  ];