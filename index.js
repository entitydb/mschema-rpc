var rpc = {};
var mschema = require("mschema");

var invoke = rpc.invoke = function (method) {

  // slice and dice method arguments
  var args = Array.prototype.slice.call(arguments);
  var callback = args.pop();
  args = args.slice(1);

  var input;
  if (Array.isArray(args)) {
    // translate args array to input object
    input = {};

    var inputKeys = Object.keys(method.input);
    args.forEach(function (arg, index) {
      input[inputKeys[index]] = arg;
    });
  } else if (typeof args === 'object') {
    input = args;
    // translate input object to args array
    args = [];

    for (var argName in args) {
      args.push(input[argName]);
    }
  } else {
    throw new Error("args must be array or object!");
  }

  // validate incoming input based on schema
  var validate = mschema.validate(input, method.input, { strict: false });
  if (!validate.valid) {
    return callback(new Error('Validation error: ' + JSON.stringify(validate.errors, true, 2)), validate.errors);
  }

  // setup output callback
  var outCallback = function (err, result) {
    // if the executed method has errored continue with error immediately
    if (err) {
      return callback(err);
    }

    // if no error was detected in executing the method attempt to,
    // validate the method's output result based on schema
    var validation = mschema.validate(result, method.output, { strict: false });
    if (!validation.valid) {
      callback(validation.errors, result);
    } else {
      callback(null, result);
    }
  };

  // execute remote method
  method.fn.apply(this, args.concat([outCallback]));
}

module['exports'] = rpc;