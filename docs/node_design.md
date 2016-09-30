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
  - Tech Stack

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

## Node Schema

```typescript
class KiiNode{
  static labelName: String, // name displayed on node before instantiated
  static description: String, // name description
  static accepts: Array<any>,  // acceptable nodes
  static accepted: Array<any>, // nodes that accepts this node 
  static acceptableProperties: Array<any>, // acceptable properties
  
  instanceName: String, // name displayed on node after instantiated
  model: Object, // node data model
  viewSchema: IViewSchema, // node view model
  propertyFlow: Array<{
    "node": KiiPropertyNode,
    "validators": Array<InputFlowValidator>
  }>,
  inputFlows: Array<{
    "node": KiiNode,
    "inputHandler": IInputHandler,
    "validators": Array<InputFlowValidator>
  }>,
  outputFlow: Array<KiiNode>
}

class KiiPropertyNode{
  static labelName: String,
  static accepted: Array<KiiNode>,
  static viewSchema: ViewSchema,
  
  instanceName: String,
  description: String,
  model: Object,
  propertyFlow: Array<{
    "node": KiiPropertyNode,
    "validators": Array<InputFlowValidator>
  }>,
  outputFlow: Array<KiiNode>
}

class InputFlowValidator{
  errorMessage: String,
  validate: (inputFlow: Object, node: KiiNode)=> boolean,
  $error: "INPUT" | "CONTENT"
}

```

## Node Template View Schema
  Every node renders its editing modal with its `View Schema`. The view schema supports inline script to render its view, validate its input. A view model will be instantiated when a node is created(shown on canvas). The first layer of Node View Schema is display fields.

  `Template View Schema` defines as:
  ```typescript
  interface IViewSchema {
    "title": String,
    "buttons": [
      {
        "buttonText": String,
        "role?": "cancel" | "submit",
        "callback?": 'cancel' | 'submit' | Function,
        "disabled": String
      }
    ],
    "viewTemplate?": String,
    "formControls?": [
      {
        "formTemplate?": String,
        "label": String,
        "maxLength?": number, // max length of input
        "minLength?": number, // min length of input
        "hidden?": String, // if hidden is true, hide the form control
        "disabled?": String, // if data is editable or not, default true,
        "placeholder?": String,
        "model?": String,
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
    ]
  }
  ```
  

  *View Example*
  ```typescript
  {
    "title": "Resource.Text.EditRuleTitle",
    "buttons": [
      {
        "buttonText": "Resource.Text.controls.ok",
        "role": "submit",
        "disabled": "form.$invalid"
      },
      {
        "buttonText": "Resource.Text.controls.cancel",
        "role": "cancel"
      }
    ],
    "viewTemplate": "default",
    "formControls": [
      {
        "label": "Resource.Text.RuleName",
        "formTemplate": "text",
        "maxLength": 100,
        "minLength": 5,
        "model": "ruleName",
        "placeholder": "Resource.Text.RuleNamePlaceholder",
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
          "msg": "Resource.Text.RuleNameExisting!"
        }]
      },
      {
        "model": "description"
        "label": "Resource.Text.Description",
        "formTemplate": "textarea",
        "maxLength": 500
      },
      {
        "model": "createAt",
        "label": "Resource.Text.CreateAt",
        "formTemplate": "label",
        "$parser": "time"
      },
      {
        "model": "updateAt",
        "label": "Resource.Text.UpdateAt",
        "formTemplate": "label",
        "$parser": "time"
      },
      {
        "model": "createBy",
        "label": "Resource.Text.CreateBy",
        "formTemplate": "label",
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
    ]
  }
  ```
## Node Types
- ### *Rule Node*
  > Entrance point of a Rule. Display on canvase initially.

  *Accept:* `Condition Node`

  *Properties:* `Schedule Node`

  *Output:* `API Node` / `Device Node`

- ### *Location Node*
  > Select location

  *Properties Output:* `Device Node`
  
- ### *Schedule Node*
  > Interval Time / Cron Job

  *Property Output:* `Rule Node`

- ### *Conjection Node*
  > Join conditions

  *Accept:* `Conjection Node` / `ML Condition Node` / `Device Condition`

  *Output:* `Conjection Node` / `Rule Node`
- ### *Deivce Node*
  > Pick Device Type

  *properties:* `Location Node`

  *Output:* `Device Property Node`
- ### *Device Property Node*
  > Pick Device Property Condition

  *Accept:* `Device Node`

  *Output:* `Conjection Node`, `Rule Node`
- ### *Action Node*
  > Pick Device actions

  *Accept:* `Device Node`

- ### *ML Node*
  > Select Machine Learning Model

  *Output:* `ML Condition Node`

- ### *ML Condition Node*
  > Pick Machine Learning Conditions

  *Output* `Conjection Node`
- ### *API Node*
  > API call when rule triggered.

  *Accept:* `Rule Node`


## Modules
### *Views*
- #### *Graph*
  - View Render
    - Path Render
    - Node Render
    - View Editor
    - State Stack
  - Node Parser
- #### *Palette*
  - Template Render
  - Node Parser
- #### *Info Panel*
  - Info Parser
  - Info Template Render
- #### *Edit Form*
  - Build-in Form controls
  - Build-in Form Templates
  - Custom Form Template register
  - Custom Form control register
  - Template Loader
  - Node Parser
  - Node Validator
    - Async
    - Sync
  - Node UI Render
- #### *Events*

### *Models*
  - _baseNode
    - Validator
    - Parser

### *Locale*
  - translate
    - CN
    - EN

## Browser supports
  >`IE 10+`, `any other browsers`
## Tech Stack
### *Libraries* 
  - Typescript
    > ES 6 polyfills.
  - SCSS
    > OO CSS Style
  - Angular 2
    > MVVM Template framework, Flux
  - Angular 2 material design
    > build-in UI components
  - rxjs
    > Data communication
  - immutableJS
    > Data state maintainer
  - d3
    > SVG lib

### *Development*
  - NPM
    > Dependency Manager
  - Webpack
    > Development building tool
  - Typings
    > Javascript Lib descriptor manager
