var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    rpc;

test("load mschema module", function (t) {
  rpc = require('../');
  t.ok(rpc, "mschema loaded");
  t.end();
});

test("rpc.invoke - valid data - with mschema", function (t) {

  var fire = {
    "type": "async",
    "description": "fires missle",
    "input": {
      "name": "string",
      "power": {
        "type": "string",
        "enum": ["high", "medium", "low"],
      },
      "warheads": {
        "type": "number",
        "min": 1,
        "max": 8,
      },
    },
    "output": {
      "result": "string"
    },
    "fn": function fireFn (name, power, warheads, callback) {
      callback(null, 'weapon fired')
    },
  };


  rpc.invoke(fire, "small missle", "low", 8, function(errors, result) {
    
    console.log(errors);
    
    t.ok(true, 'weapon fired')
    t.end();
  });

});

test("rpc.invoke - invalid data - with mschema", function (t) {

  var fire = {
    "type": "async",
    "description": "fires missle",
    "input": {
      "name": "string",
      "power": {
        "type": "string",
        "enum": ["high", "medium", "low"],
      },
      "warheads": {
        "type": "number",
        "min": 1,
        "max": 8,
      },
    },
    "output": {
      "result": "string",
    },
    "fn": function fireFn (name, power, warheads, callback) {
      callback(null, 'weapon fired')
    },
  };

  rpc.invoke(fire, "small missle", "unknown", 10, function(err, result) {
    t.type(result, Array);
    t.equal(result.length, 2);
    t.equal(result[0].property, "power");
    t.equal(result[0].constraint, "enum");
    t.similar(result[0].expected, ["high", "medium", "low"]);
    t.equal(result[0].actual, "unknown");
    t.equal(result[0].value, "unknown");
    t.ok(true, 'weapon not fired')
    t.end();
  });
});

test("rpc.invoke - invalid data - with mschema", function (t) {

  var fire = {
    "type": "async",
    "description": "fires missle",
    "input": {
      "name": {
        "type": "string",
        "required": true,
      },
      "password": {
        "type": "string",
        "required": true,
      },
    },
    "fn": function fireFn (name, power, warheads, callback) {
      callback(null, 'weapon fired')
    },
  };

  rpc.invoke(fire, "hi", "", function(err, result) {
    console.log(err, result)
    t.type(err, "object");
    t.ok(true, 'weapon not fired')
    t.end();
  });
});
