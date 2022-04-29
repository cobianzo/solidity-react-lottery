# Lottery smart contract in React:

React is the frontend for this smart contract project, which uses Web3 library with a Provider to provide the Network of nodes.
When testing, the network is simulated by `garache`, a tiny network library.
When not testing, we need to update the provider, to use the Metamask network, in Test mode (otherwise costs money!)

## TEST this project as it is:

- npm i
- `npx mocha`, or `npm run test`
  And to deploy it, we need to set up infura.io, and get the endpoint
- `node deploy.js`
  And we will get the address of the new contract, ie  
  `Contract deployed to 0x1f87BbdC0221bE67D473110A67ef6A08fB040000`  
  From there we could continue with Remix interface and Metamask

## WHERE the smart contract is:

# TUTORIAL OF CREATION/NOTES

- `create-react-app`, clean up stupid idle code that comes by default
  -- IMPORTANT: in package.json it should use "react-scripts": "4.0.3", in order to be compatible with web3 and our code.
- install Web3 Library straight away!: `npm i web3`
- we assume metamask chrome extension is installed, so we will use its provider to connect to Rinkeby network. But it is just for this project. We can't assume in any real project!
- Deploy the Lottery project outside this react project. We created that project and we can use 'node deploy', and console log the address of the contract and the ABI interface of that contract.
  -- We copy that data to use in in out react app.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
