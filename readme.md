# Data Access Gateway Chrome Extension

This is the source code for the [Data Access Gateway library](https://github.com/MrDesjardins/dataaccessgateway). The goal of this Chrome Extension is to receive statistics about how the data is fetched and saved by the library.

## Consumer Readme
The extension goal is to provide insight about how the library is manipulating the data. It will indicate how many question are still pending (on-going request), and will give information about which source of data is trying read and write (memory, IndexDb or Http). It also give statistic to which of the three source the data is used as well as a complete list of URL (id) that is being accessed by the system.

## Developer Readme
If you want to contribute to this Chrome Extension here are some details.

The technologies used it TypeScript and React. TypeScript is used for the agent and the Chrome Extension which is a panel that is inserted in the Chrome's developer tool. React is used inside the panel where the information about the Data Access Gateway.

At the moment, to build to code has many caveats. First, it requires some specific orders to build the two projects (panel and Chrome extension). The panel must be build first, and then the extension. At the moment, both use a `manifest.json`. The manifest is useful for the React application when ran in a standalone mode (in the browser without being in the Chrome extension, and the Chrome extension's manifest is needed on the deployement. Second, it is possible work on the panel without hosting the Chrome panel. This make the development faster. You can leverage the `create-react-app`. There is fake data pushed into the React application which allows to test the panel UI. It is faster to developer because every change are automatically compiled and the browser refresh. A third caveat is how to execute the NPM scripts. Some copy use `cpx` but some not. For some reasons it does not work properly when moving code between the two projects. I have not invested any time on it and focused that it work on a Mac OS. I'll fix that later.

### Here are the steps for developing the panel:

1. At the root: `npm install`
2. Move to the `devpanel`
3. `yarn install`
4. To run in browser: `npm run start`
or
4. To build: `npm run fullbuildmac`. This will build and move the files in the extension `dist` folder.

### Here are the steps for building the Chrome's extension:

1. At the root: `npm install`
2. `npm run build`
3. Go in the developer tool of Chrome, load the package to the `dist` folder.

When developing the extension, make sure to always:

1. Reload the extension from the Chrome's Extension `chrome://extensions`
2. Close and open the Chrome's Dev Tools
3. Refresh the page you are testing the extension