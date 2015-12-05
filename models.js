/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.SchemaTypes.ObjectId;
var Mixed = mongoose.SchemaTypes.Mixed;
var mongoosePaginate = require('mongoose-paginate');


// tasks
var taskSchema = mongoose.Schema({
  planid: ObjectId,
  triggerby: {type: String, default: 'SYSTEM'},
  triggerat: {type: Date, default: Date.now},
  started: {type: Boolean, default: false},
  startat: Date,
  passed: {type: Boolean, default: false},
  done: {type: Boolean, default: false},
  doneat: Date,
  build: {type: String, default: ''},
  caseset: [String],
  device: [String],
  actions: [String],
  consolelink: {type: String, default: ''}, // set when task start
  loglink: {type: String, default: ''}, // set when task done
  result: Mixed
});
taskSchema.index({planid: 1, build: 1});
taskSchema.plugin(mongoosePaginate);
module.exports.Task = mongoose.model('task', taskSchema);


// remote actions
var actionSchema = mongoose.Schema({
  name: String,
  id: Number,
  desc: String,
  exec: String,
  createby: String,
  createat: {type: Date, default: Date.now},
  updateat: {type: Date, default: Date.now}
});
module.exports.Action = mongoose.model('action', actionSchema);


// agents
var agentSchema = mongoose.Schema({
  name: String,
  ip: String,
  available: {type: Boolean, default: false},
  labels: [String],
  createat: {type: Date, default: Date.now},
  updateat: {type: Date, default: Date.now},
  runners: {
    all: Number,
    running: Number
  }
});

agentSchema.statics.createOrUpdate = function(ip, data, callback) {
  this.findOne({ip: ip}, function(err, agent) {
    if (err) return callback(err);

    if (agent === null) agent = new Agent();

    agent.ip = ip;
    agent.name = data.name;
    agent.available = data.available || true;
    agent.labels = data.labels;
    agent.updateat = Date.now();
    agent.runners = data.runners;

    agent.save(function(err, a) {
      callback(err, a);
    });
  });
};

var Agent = module.exports.Agent = mongoose.model('agent', agentSchema);

