# Node design
## Table of Content
  - Application Inline Scripting
  - Node Design
    - Attributs 
    - Connection Mechanism
    - Schema
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

## Application Data service
  In this application, different scope of data will be accessed. Basically, there are four types of data source: `Config`, `Application`, `Cache`, `Doc`. 

  `Config` is a global JSON object which is read from `/node-config.json`.

  `Application` is a global JSON object which storesrun time data. Data will be cleared after application is destroyed.

  `Cache` is a session-wide key paire storage. Data will be stored locally until removed by program or expired. Expire time can be specified or set by default (default value is defined in `/config.js`). 

  `Doc` is a model-wide JSON object. It is used to access `View Model Instance`'s data. It can be accessed by calling `${doc}`.

## Node attributes and Connection mechanism
### Node Attributes
Unlike NodeRed, which uses nodes to represents a chain (flow) of ordered actions, the result of nodes chain in our design does not have strong order and procedure information, but a clear hierarchical data structure. Therefore, the connection points of a node may have the following meaning:

![Markdown](http://p1.bqimg.com/1949/d12c0f980b51fc69.png)

We may need to consider whether we support a single node to have explicit multiple (different) descriptors and impacts connection points.

 - we don't support it now and in the future?
 - we don't support it now and may support it in the future?
 - we will support it in the initial patch?

In order to support business logics of nodes application (in our case: rules engine, reporting creation, maybe others later), a node may generally have the following attributes regardless of UI visibility:

 - **Node Type**: indicating the type of nodes for query and management purpose
 - **Node Category**: even wider range of node grouping for query and management purpose
 - **Node ID**: unique ID for each node entity for identification purpose
 - **Default display Name**: based on node type, indicating what is displayed on the node by default
 - **Primary**: indicating whether the node is mandatory and not deletable in a nodes application. a nodes chain should only have one primary node, and there should be only one node chain in a view. e.g. a Rule node is primary in rule creation view, and should exists once entering the view.
 - **DescriptorAccepts**: lists what nodes can be connected to the node as descriptors. this attribute can be used to
  - dynamically show the available neighbors of a node in the UI.
  - prevent nodes connections of not-connectable nodes
 
 it is possible that whether a node can be the descriptor of another node can be dynamic. we may also need to consider the situation.
 - **ImpactAccepts**: lists what nodes can be connected to a node as impacts
 - **DescriptorConnected**: lists nodes that have been connected to a node as descriptors
 - **ImpactConnected**: lists nodes that have been connected to a node as impacts
 - **Position**: for UI purpose only, indicating where the node is on the canvas
 - **Property**: business setting data of a node

[Please extend the above list if needed.]

### Node Connection Mechanism
#### Connection validity

In NodeRed, all nodes can be connected to each other with no restriction, and developer will need to debug to see if a flow works as expected. In our case, we do not want users to go through try-and-failure process, but responsively create rules with intuitive UI. In practice, we need to try to eliminate connection errors even before nodes are incorrectly connected. Attempts could be:

 - showing the availability of neighbors of a node when it is selected, in order to avoid wrong related nodes being introduced
 - preventing two incompatible nodes being connected when the user attempts to connect them
 - showing the status of connection lines (some node property setting may influence the validity of connection?)

#### Data exchange between nodes

Once two nodes are connected, they should be able to exchange data closely each other to enable some dynamic settings. Also, there may need a message object accessible throughout a node chain to pass global information. This is useful to raise errors/warning and avoid nodes conflicts.

## Node Schema

Regard of concerns above, a node will have following components:
- Inputs are other KiiNodes that will impact this node.
- Listener subscribes and handles input nodes' changes.
- Node Body holds node's dataset.
- View Model defines the Node-Edit Form UI.
- Info Model defines the Info Panel UI
- Palatte Model defines the Node selection Palatte UI.
- Observable provide output interfaces for other nodes.
![](https://i.imgsafe.org/b478eacc67.png)

The structure is described as the following class.
```typescript
// base class
class KiiNode{
  static labelName: String, // name displayed on node before instantiated
  static description: String, // name description
  static accepts: Array<any>,  // acceptable nodes
  static accepted: Array<any>, // nodes that accepts this node 
  static acceptableProperties: Array<any>, // acceptable properties
  
  instanceName: String, // name displayed on node after instantiated
  model: Object, // node data model
  viewSchema: IViewSchema, // node view model
  propertyFlow: Array<KiiPropertyNode>,
  inputFlows: Array<KiiNode>,
  validator: IKiiNodeValidator,
  outputFlow: Array<KiiNode>
}

// property class
class KiiPropertyNode{
  static labelName: String,
  static accepted: Array<KiiNode>,
  static viewSchema: ViewSchema,
  
  instanceName: String,
  description: String,
  model: Object,
  Output: Observable
}

class InputFlowValidator{
  errorMessage: String,
  validate: (inputFlow: Object, node: KiiNode)=> boolean,
  $error: "INPUT" | "CONTENT"
}

```


*Node Data Flow*
  
  - With structure above, the data flow is given as below. 

  ![](https://i.imgsafe.org/b4f4d06f82.png)

## ViewModel
  Every node renders its editing modal with its `ViewModel`. The view schema supports inline script to render its view, validate its input. A view model will be instantiated when a node is created(shown on canvas).

  `ViewModel` defines as:
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
        "formTemplate?": String | Directive,
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
  
  ![](https://i.imgsafe.org/b510615e28.png)
  

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
  *Expected UI*

  ![](https://i.imgsafe.org/b17fa3408e.png)

  *Edit Workflow*
  ![](https://i.imgsafe.org/b32027486f.png)

  *View Rendering Flow*
  - The View renderer starts at `modelValue` with given default value. 
  - `formatter` format the `modelValue` to `viewValue`.
  - View `renderer` generate `scope values` and `view` to interact with user. User input changes scopevalues and updates the view.
  - A `watcher` observes `scope values`, once values changed, validators will validate user's input.
  - If input is valide, `scope values` will be dispatched to `parser`, `parser` will parse scope values and update `modelValue`. If `scope values` are not valide, `validator` will inform `modelValue` that current state is not valide.

  ![](https://i.imgsafe.org/affdd8f9ac.png)


## InfoModel
Node's info modal is defined by its `InfoModel`. 
```typescript
  interface IInfoSchema {
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
        "formTemplate?": String | Directive,
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
  
## PalatteModel
  Node's palatte modal is defined by its PalatteModel.
  ```typescript
  interface INodeSet{
    setName: String,
    nodeList: Array<{
      type: Function, // KiiNode
      name: String, // node name
      injects: Object // inject values
    }>
  }
  interface IPalatteView{
    nodeSets: Array<INodeSet>
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
  - Typescript@>2.0
    > ES 6 polyfills.
  - SCSS
    > OO CSS Style
  - Angular 2@>2.0.0
    > MVVM Template framework, Flux
  - Angular 2 material design
    > build-in UI components
  - rxjs
    > Data communication
  - immutableJS
    > Data state maintainer
  - d3@v4
    > SVG lib

### *Development*
  - NPM
    > Dependency Manager
  - Webpack
    > Development building tool
  - Typings
    > Javascript Lib descriptor manager
