import { parentPort } from 'worker_threads';
import fs from 'fs';
import { performance } from 'perf_hooks';
import checkDiskSpace from 'check-disk-space';

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
    const fileData =  allWords.join(' ');
    var outputFolderDiskUsage;
    var uploadFolderDiskUsage;

    try {
      outputFolderDiskUsage = await checkDiskSpace(outputPath);
      uploadFolderDiskUsage = await checkDiskSpace(uploadPath);
    } catch (error) {
      // error
    }
    const diskSpace = 80000000;
    const remainingDiskSpace = outputFolderDiskUsage + uploadFolderDiskUsage;
    console.log("remainingDiskSpace", remainingDiskSpace,  "outputFolderDiskUsage",  outputFolderDiskUsage,  "uploadFolderDiskUsage",  uploadFolderDiskUsage);
    const flagData = fs.readFileSync(flagPathName).toString(); 
    console.log(`BOOL >${flagData}<`, flagData.includes("true"));
    if (flagData.includes("false") && fileData.length < remainingDiskSpace)
      fs.writeFileSync(`${dir}/${filename}`, fileData);
    else {
      parentPort.postMessage({error: "Insufficient space"})
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
