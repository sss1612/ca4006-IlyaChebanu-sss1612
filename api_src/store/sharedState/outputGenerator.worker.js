import { parentPort } from 'worker_threads';
import fs from 'fs';
import { performance } from 'perf_hooks';
import axios from "axios";

/* taken and modified from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function fisherYates( array ){
  var count = array.length,
      randomnumber,
      temp;
  let lastTime = performance.now();
  while( count ){
    randomnumber = Math.random() * count-- | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp
    if (count % 10000 === 0) {
      const currentTime = performance.now();
      const time = currentTime - lastTime;
      lastTime = currentTime;
      parentPort.postMessage({ completed: false, words: array.length - count, tpw: time / 10000 });
    }
  }
}
// store may not update on time
const cache = { lastAvailableDiskSpace: null, fileSizes: [0] };
parentPort.on('message', async (message) => {
  const { data, availableDiskSpace } = message;
  const words = { ...data.wordsCount };
  const { filename } = data;

  let completedWords = 0;

  let keys = Object.keys(words);

  const allWords = new Array(data.totalWordCount);
  let i = 0;
  keys.forEach(word => {
    for (let j = 0; j < words[word]; j++) {
      allWords[i] = word;
      i++;
    }
  });

  fisherYates(allWords);

  parentPort.postMessage({ completed: false, words: data.totalWordCount, shuffled: true, });

  const time = performance.now();
  try {
    const dir = `${__dirname}/../../../../output_files`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const fileData = allWords.join(' ');
    console.log(availableDiskSpace, "file size", fileData.length)
    await axios.post("http://localhost:8080/outputsizetracker", {availableDiskSpace})
    fs.writeFileSync(`${dir}/${filename}`, fileData);
  } catch (error) {
    console.error(error);
  }


  parentPort.postMessage({
    completed: true,
    words: completedWords,
    fileWritingOverhead: (performance.now() - time) / data.totalWordCount
  });
});
