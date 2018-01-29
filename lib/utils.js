const { cyan, gray, red, yellow } = require('chalk');

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

exports.log = console.log;
exports.logError = function (message) {
  console.error(red(message));
};
exports.logInfo = function (message) {
  console.info(cyan(message));
};

exports.print = function (command) { // config.commands.map(c => `oc ${c.name}\n`).join('')
  const output = [];
  output.push(`\noc ${command.name}`);
  if (command.description)
    output.push(`  ${command.description}`);
  if (validArgs(command.aliases))
    output.push(gray(`  aliases: ${command.aliases.join(', ')}`));
  if (validArgs(command.options)) {
    output[0] += cyan(` <option...>`)
    command.options.forEach(op => output.push(
      '  '
      + cyan('--' + op.name)
      + (op.type ? cyan(' (' + op.type + ')') : '')
      + (op.description ? ` ${op.description}` : '')
    ));
  }

  return console.log(output.join('\n'));

  function validArgs(o) { return Array.isArray(o) && o.length };
}