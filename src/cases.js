import { websiteCases } from './websiteCases.js';
import work from '../content/work.json';
import data from '../content/portfolio.json';
import research from '../content/research.json';
export const cases = [...work.engineering, ...work.research, ...data.projects, work.kita, ...research.papers, ...research.patents, ...research.robotics, ...websiteCases.filter(item=>item.id!=='kita')];
export const findCase = id => cases.find(item => item.id === id);
