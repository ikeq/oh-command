const fs = require('fs');
const path = require('path');
const utils = require('./utils');

module.exports = function (cwd, args) {
  cwd = cwd || process.cwd();
  args = args || process.argv.slice(2);

  // attempt to load config file
  const configPath = path.join(cwd, './.oh-command.json');
  let config = null;
  if (!fs.existsSync(configPath)) {
    return utils.logError('No `.oh-command.json` found.');
  } else {
    try {
      config = require(configPath);
    } catch (e) {
      return utils.logError('Unable to parse `.oh-command.json`.');
    }
  };

  // look up command
  let commandName = args.shift();
  if (!commandName) {
    utils.log('Available commands');
    config.commands.forEach(utils.print);
    return;
  }

  let currentCommand = utils.lookupCommand(config.commands, commandName);
  if (!currentCommand) {
    return utils.logError(`Unknow command \`${commandName}\`.`);
  }

  let [parsedArgs, argsErrors] = utils.parseArgs(args, currentCommand.options || []);
  if (argsErrors.length) return utils.logError(argsErrors[0].errors[0]);

  // attempt to load entry file
  let entryPath = path.join(cwd, utils.type(config.root) === 'string' ? config.root : '', config.entry);
  let entry = null;
  if (!fs.existsSync(entryPath)) {
    return utils.logError('No entry file found, nothing to do.');
  } else {
    try {
      entry = require(entryPath);
    } catch (e) {
      return utils.logError(e);
    }

    // entry must be a function
    if (utils.type(entry) !== 'function') {
      return utils.logError('`entry` must be a function.');
    }
  };

  entry(currentCommand.name, parsedArgs)
}