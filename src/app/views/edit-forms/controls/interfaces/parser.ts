export interface IJNFormParser{ // parse modal data to view data
  "async?": boolean, // default false, run async parser or not
  "remote?": { // enabled only when async is true
    "url": String, // remote url
    "method?": String, // calling method
    "headers?": JSON, 
    "body?": String | JSON
  },
  "parse?": ()=>{} | string
}