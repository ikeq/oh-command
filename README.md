# oh-command

A nodejs commands wrapper for convenience.

## Why

If you are using nodejs commands as below,
```bash
node ./index.js --command=build --module=myapp

# or via npm scripts
npm run build -- --module=myapp
```

consider making it more elegant.

## Usage

### install

```bash
npm i oh-command -g
```

### adding `.oh-command.json` config file

```javascript
{
  "root": "",
  "commands": [
    {
      "name": "build",
      "aliases": [ "b" ],
      "options": [
        { "name": "module", "type": "String", "description": "Specifies module to build." },
        { "name": "all", "type": "Boolean", "description": "Build all modules." }
      ],
      "description": "Builds source code and places it into the output path."
    },
    {
      "name": "serve",
      "aliases": [ "s" ],
      "options": [
        { "name": "module", "type": "String" }
      ]
    }
  ],
  "entry": "index.js"
}
```

Now you can use command as follows.

```bash
oc build --module=myapp
oc serve --module=myapp
```

The `entry` must be a function and the command and arguments will be passed in, for example.

```bash
# command
oc build --module=myapp
```

```javascript
// entry
module.exports = function(command, commandArgs) {
  console.log(command); // build
  console.log(commandArgs); // { module: "myapp" }
}
```

## License
[MIT](https://github.com/elmorec/oh-command/blob/master/LICENSE)