# Scratch Project Guides

Guides for [Scratch](https://scratch.mit.edu/) projects.

## Developing

### Global Dependencies

[Node.js](https://nodejs.org/)

### Building and Running

Set Node version

```
nvm use
```

Install project dependencies

```
npm i
```

Run the generation script to parse the markdown documents and create javascript objects

```
npm run generate-projects
```

Run development server

```
npm run dev
```

### Code Quality

There are various code quality checks you can run with

```
npm run format
npm run lint
npm run check
```

### Testing

The project uses playwright for end-to-end testing. You can run the test suite with

```
npm run test
```

### Useful Links

[REPL](https://scratchblocks.github.io/#?style=scratch3&script=)

[Scratchblocks Syntax Guide](https://en.scratch-wiki.info/wiki/Block_Plugin/Syntax)
