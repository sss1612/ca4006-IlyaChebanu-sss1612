import "regenerator-runtime/runtime";
import express from "express";
import * as fs from "fs";
import store from "./store/store";
import uploadRouter from "./endpoints/upload";
import filterRouter from "./endpoints/filter";
import { actions as userUploadActions } from "../shared/store/userUpload";

const uploadPath = `${__dirname.split("/api_dist")[0]}/uploads`;

// populate currurent files in uploads dir
fs.readdir(uploadPath, (err, files) => {
    files.forEach(file => {
        store.dispatch(userUploadActions.addNewFilename(file));
    });
  });

  // setTimeout(() => {
//     for (let i = 0; i < 10; i++) {
//         store.dispatch(userUploadActions.test("dingus amingus"))
//         store.dispatch(userUploadActions.test("dingus amingus"))
//     }
// }, 5000);

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get("/", (req, res) => {
    res.send(store.getState());
});

app.use(uploadRouter);
app.use(filterRouter);

app.listen("8080", () => console.log("Please visit http://localhost:8080 in your browser!"));
