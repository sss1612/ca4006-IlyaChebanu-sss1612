import { parentPort } from 'worker_threads';
import * as fs from "fs";
const alphabet = "abcdefghijklmnopqrstuvwxyz"
parentPort.once('message', bodyData => {

  const { filename, filter } = bodyData;
  
  
  const [firstLetter, secondLetter] = filter.split("-");
    
  const firstLetterIndex = alphabet.indexOf(firstLetter);
  const secondLetterIndex = alphabet.indexOf(secondLetter);

  const [index1, index2] = firstLetterIndex <= secondLetterIndex
    ? [firstLetterIndex, secondLetterIndex+1]
    : [secondLetterIndex, firstLetterIndex+1]

    const letterBoundary = alphabet.slice(index1, index2);

    // complete build path 
  const uploadsFilePath = `${__dirname.split("/api_dist")[0]}/uploads/${filename}`;
  const filteredFileLines = fs.readFileSync(uploadsFilePath).toString().split("\n").filter(line => {
    const [, word] = line.split("\t");
    try {
        return letterBoundary.includes(word[0].toLowerCase()); // filter first --> last char
    } catch (e) {
        // undefined
    }
    return false;
  });
  const chunkStats = {
    filter,
    totalWordCount: 0,
    wordsCount: {},
    letterCount: {}
  };

  const getWordChunkCount = new Promise((resolve, reject) => {
    var totalWordCount = 0;
    filteredFileLines.forEach(line => {
      const [, ,word , count] = line.split("\t");
      totalWordCount += parseInt(count);
      chunkStats.wordsCount[word] = parseInt(count.trim());
    });

    chunkStats.totalWordCount = totalWordCount;
    resolve();
  });
    
    const getCharChunkCount = new Promise((resolve, reject) => {

    filteredFileLines.forEach(line => {
      const [, word] = line.split("\t");

      for (var i = 0; i < word.length; i++) {
        const char = word.charAt(i).toLowerCase();

        if (alphabet.includes(char) && char in chunkStats.letterCount) {
          chunkStats.letterCount[char]++;
        } else {
          chunkStats.letterCount[char] = 1;
        }
      }
    });
    resolve();
  })
  Promise.all([getWordChunkCount, getCharChunkCount]).then(() => {
      parentPort.postMessage(chunkStats);
  });
});
