# mschema-rpc

Minimalistic [Remote Procedural Call](http://en.wikipedia.org/wiki/Remote_procedure_call) library using [mschema](http://mschema.org) validation for remote method's input and output.

## Features

 - Provides validation to functions incoming arguments and outgoing results
 - Validation based on [mschema](http://mschema.org)

# API

### rpc.invoke(method, methodSchema, args..., callback)

### method
the method to be executed remotely

### methodSchema
the schema to be used to validate the input and output of `method`

### args
the args to be sent to `method`

**schema format**
```json
{
  "type": "async" || "sync",
  "input": {
    "key": "val"
  },
  "output": {
    "key": "val"
  }
}
```
*see: http://github.com/mschema/mschema for full schema format documentation*

### callback

the callback to be executed after `method` has been invoked

## Example

```js 

var rpc = require('mschema-rpc');

var fireSchema = {
  "type": "async",
  "description": "fires missle",
  "input": {
    "name": "string",
      "power": {
        "type": "string",
        "enum": ["high", "medium", "low"]
      },
      "warheads": {
        "type": "number",
        "min": 1,
        "max": 8
      }
    },
  "output": {
    "result": "string"
  }
};

function fireFn (name, power, warheads, callback) {
  callback(null, 'weapon fired');
}

rpc.invoke(fireFn, fireSchema, "small missle", "low", 8, function(errors, result) {
  console.log('errors', errors);
  console.log('result', result);
});
```