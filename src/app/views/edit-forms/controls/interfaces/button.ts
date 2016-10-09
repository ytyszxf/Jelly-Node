export interface IJBFormButton{
  "buttonText": String,
  "role?": "cancel" | "submit",
  "callback?": 'cancel' | 'submit' | Function,
  "disabled": String
}