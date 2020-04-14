
import { parentPort } from 'worker_threads';
import fs from 'fs';
import { performance } from 'perf_hooks';

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


const slash = process.platform === "win32"
?  "\\"
: "/"
const uploadPath = `${__dirname.split(`${slash}api_dist`)[0]}${slash}uploads`;
const outputPath = `${__dirname.split(`${slash}api_dist`)[0]}${slash}output_files`;
const flagPathName = `${__dirname.split(`${slash}api_dist`)[0]}${slash}flag.txt`;

parentPort.on('message',async data => {
  const words = { ...data.wordsCount };
  const { filename, softLimit } = data;

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

  const dir = `${__dirname}/../../../../output_files`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const fileData = allWords.join(' ');

  const oFiles = fs.readdirSync(outputPath);
  const outputFolderDiskUsage = oFiles.reduce((acc, file) => {
    const fileSize = fs.statSync(`${outputPath}${slash}${file}`).size;
    return acc+fileSize
  },0)

  const uFiles = fs.readdirSync(uploadPath);
  const uploadFolderDiskUsage = uFiles.reduce((acc, file) => {
    const fileSize = fs.statSync(`${uploadPath}${slash}${file}`).size;
    return acc+fileSize;
  },0)


  const remainingDiskSpace = softLimit - (outputFolderDiskUsage + uploadFolderDiskUsage);
  const flagData = fs.readFileSync(flagPathName).toString();

  try {
    if (flagData.includes("false") && fileData.length < remainingDiskSpace)
      fs.writeFileSync(`${dir}/${filename}`, fileData);
    else {
      const responseString = flagData.includes("true") ? "Disk full (Simulated disk blocking)" : `Insufficient space:\n ${((fileData.length - remainingDiskSpace) / 1000000).toFixed(3)}MB remaining\n${(parseInt(fileData.length) / 1000000).toFixed(3)}MB required\n`
      parentPort.postMessage({error:responseString })
    }
  } catch (error) {
    console.error(error);
  }


  parentPort.postMessage({
    completed: true,
    words: completedWords,
    fileWritingOverhead: (performance.now() - time) / data.totalWordCount
  });
});
