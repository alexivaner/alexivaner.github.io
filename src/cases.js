import work from '../content/work.json';
import data from '../content/portfolio.json';
import research from '../content/research.json';
export const cases = [...work.engineering, ...work.research, ...data.projects, work.kita, ...research.papers, ...research.patents, ...research.robotics];
export const findCase = id => cases.find(item => item.id === id);
