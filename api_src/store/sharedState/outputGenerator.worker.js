import { parentPort } from 'worker_threads';
import fs from 'fs';

const randomKey = obj => {
  const keys = Object.keys(obj);
  return keys[keys.length * Math.random() << 0];
}

parentPort.once('message', data => {
  const words = { ...data.wordsCount };

  const outputWords = [];

  while (Object.keys(words).length > 0) {
    const key = randomKey(words);
    outputWords.push(key);
    words[key] -= 1;
    if (words[key] <= 0) {
      delete words[key];
    }
  }

  const filename = `${new Date().toISOString()}.dat`;

  try {
    const dir = `${__dirname}/../../../../output_files`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${filename}`, outputWords.join(' '));
  } catch (error) {
    console.error(error);
  }

  // console.log('yo')

  parentPort.postMessage(filename);
});
