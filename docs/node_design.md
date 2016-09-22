# Node design
## Table of Content
  - Application Inline Scripting
  - Node Template View Schema
  - Node Types
    - Rule Node
    - Location Node
    - Schedule Node
    - Conjection Node
    - Deivce Node
    - Property Node
    - Action Node
    - ML Node
    - API Node

## Application Inline Scripting
  Inline Scripting is used in the application for rendering views. To use the inline-scripting,  Basically, the scripting has five types of data source: `Config`, `Application`, `Cache`, `Doc`, `Async`. 

  `Config` is a global JSON object which is read from `/node-config.json`. Inline-scripting is able to get its value by calling `${Config}`.

  `Application` is a global JSON object which storesrun time data. Data will be cleared after application is destroyed. It can be accessed by calling `${Application}`.

  `Cache` is a session-wide key paire storage. Data will be stored locally until removed by program or expired. Expire time can be specified or set by default (default value is defined in `/config.js`). 
  ```javascript
  // set Cache
  ${Cache.set(key, value, expireTime?)}

  // get Cache
  ${Cache.get(key)}

  // remove Cache
  ${Cache.remove(key)}
  ```

  `Doc` is a model-wide JSON object. It is used to access `View Model Instance`'s data. It can be accessed by calling `${doc}`.

  `Async` is a method-wide JSON object. It is used to processing async callback data. It can be accessed by calling `${response}`.
  
## Node Template View Schema
  Every node renders its editing modal with its `View Schema`. The view schema supports inline script to render its view, validate its input. A view model will be instantiated when a node is created(shown on canvas). The first layer of Node View Schema is display fields.

  `Template View Schema` defines as:
  ```javascript
  {
    [field name]: {
      "type": String | number | JSON | boolean, Array
      "label": String,
      "maxLength?": number, // max length of input
      "minLength?": number, // min length of input
      "editable?": boolean, // if data is editable or not, default true,
      "placeholder?": String,
      "$validate?":[{ // validate input
        "async?": boolean, // default false, run async validate or not
        "checkWhen?": "change" | "save", // default "change", run validate when changed or on save button click
        "remote?": { // enabled only when async is true
          "url": String, // remote url
          "method?": String, // calling method
          "headers?": JSON,
          "body?": String | JSON
        },
        "validator": [validateFuncs] | $Script,
        "msg?": String
      }],
      "$parser?": { // parse modal data to view data
        "async?": boolean, // default false, run async parser or not
        "remote?": { // enabled only when async is true
          "url": String, // remote url
          "method?": String, // calling method
          "headers?": JSON, 
          "body?": String | JSON
        },
        "parse?": [parseFuncs] | $Script
      },
      "$formatter?": [formatterFuncs] | $Script // formate view data to modal data
    }
  }
    
  ```
  
## Node Types
### *Rule Node*
  > Entrance point of a Rule. Display on canvase initially.

  *Accept:* `Condition Node`, `Property Node`

  *Output:* `API Node`, `Device Node`

  *Edit structure*
  ```javascript
  {
    "ruleName": {
      "type": String,
      "label": "Rule Name",
      "maxLength": 100,
      "default": 
      "editable": true,
      "placeholder": "Input a Rule Name...",
      "$validate": [{
        "async": true,
        "checkWhen": "change",
        "remote": {
          "url": "${config.apiUrl}/checkRulename",
          "method": "post",
          "headers": {
            'Authorization': '${application.authToken}'
          },
          "body": {
            "ruleName": "${doc.ruleName.value}"
          }
        },
        "validator": "${response.ok}",
        "msg": "Rule name existing!"
      }]
    },
    "description": {
      "label": "Description",
      "type": String,
      "display": "textarea"
      "maxLength": 500,
      "editable": true
    },
    "createAt": {
      "label": "Created At",
      "type": String,
      "editable": false,
      "$parser": "time"
    },
    "updateAt": {
      "label": "Updated At",
      "type": String,
      "editable": false,
      "$parser": "time"
    },
    "createBy": {
      "label": "Created By",
      "type": String,
      "editable": false,
      "$parser": {
        "async": true,
        "remote": {
          "url": "${config.apiUrl}/users/${doc.createBy.value}",
          "method": "get",
          "header": {
            'Authorization': '${application.authToken}'
          }
        },
        "parse": "${response.userName}"
      }
    },
    "updateBy": {
      "label": "Updated By",
      "type": String,
      "editable": false,
      "$parser": {
        "async": true,
        "remote": {
          "url": "${config.apiUrl}/users/${doc.createBy.value}",
          "method": "get",
          "header": {
            'Authorization': '${application.authToken}'
          }
        },
        "parse": "${response.userName}"
      }  
    }
  }
  ```
### *Location Node*
  > Select location

  *Accept:* 

  *Output:*
### *Schedule Node*
  >

  *Accept:* 

  *Output:*
### *Conjection Node*
  >

  *Accept:* 

  *Output:*
### *Deivce Node*
  >

  *Accept:* 

  *Output:*
### *Property Node*
  >

  *Accept:* 

  *Output:*
### *Action Node*
  >

  *Accept:* 

  *Output:*
### *ML Node*
  >

  *Accept:* 

  *Output:*
### *API Node*
  >

  *Accept:* 

  *Output:*