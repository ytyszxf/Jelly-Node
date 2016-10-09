export interface IJBFormValidator{ // validate input
  "async?": boolean, // default false, run async validate or not
  "checkWhen?": "change" | "save", // default "change", run validate when changed or on save button click
  "remote?": { // enabled only when async is true
    "url": String, // remote url
    "method?": String, // calling method
    "headers?": JSON,
    "body?": String | JSON
  },
  "validator": ()=>{} | string,
  "msg?": String
}