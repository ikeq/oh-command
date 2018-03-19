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
    for (let command of commands) {
      let { name, aliases } = command;

      if (name === commandName || aliases.some(aliasMatches)) {
        return command;
      }
    }
  }
}

exports.parseArgs = function parseArgs(args, options) {
  let cliArgs = {},
    out = {},
    argWithoutKeys = [],
    errors = [];
  const ERRORS = {
    'required': o => `\`${o}\` option is required`,
    'type': o => `\`${o}\` option is invalid`,
    'required': o => `\`${o}\` option is required`,
  }

  for (let arg of args) {
    if (arg.startsWith('--')) {
      arg = arg.substring(2, arg.length).split('=');

      cliArgs[arg[0]] = arg[1] ? arg[1] : true;
    }
    else {
      argWithoutKeys.push(arg);
    }
  }

  options.forEach(option => {
    if (cliArgs.hasOwnProperty(option.name)) {
      out[option.name] = cliArgs[option.name]
    }

    if (option.short && argWithoutKeys.length) {
      out[option.name] = argWithoutKeys[0];
    }

    // validation
    let error = [];
    if (option.required && !out.hasOwnProperty(option.name)) error.push(ERRORS.required(option.name));
    else if (out[option.name] && option.type && option.type.toLowerCase() !== exports.type(out[option.name])) error.push(ERRORS.type(option.name));

    if (error.length) errors.push({ name: option.name, errors: error });
  })

  return [out, errors];
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