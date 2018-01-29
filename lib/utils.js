exports.type = function type(o) {
  return Object.prototype.toString.call(o).split(' ')[1].slice(0, -1).toLowerCase()
}

exports.lookupCommand = function lookupCommand(commands, commandName) {
  let command = findCommand(commands, commandName);

  if (command) {
    return command;
  }

  function aliasMatches(alias) {
    return alias === commandName;
  }

  function findCommand(commands, commandName) {
    for (let i = 0; i < commands.length; i++) {
      let { name, aliases } = commands[i];

      if (name === commandName || aliases.some(alias => alias === commandName)) {
        return name;
      }
    }
  }
}

exports.parseArgs = function parseArgs(args) {
  let out = {};

  for (let arg of args) {
    if (arg.startsWith('--')) {
      arg = arg.substring(2, arg.length).split('=');

      out[arg[0]] = arg[1] ? arg[1] : true;
    }
  }
  return out;
}

exports.logError = console.log;