<h1 align="center">
  wExplore
</h1>

## 🚀 Demo

## 💥 Usage

## 🧐 Features

## 🛠️ Installation Steps

1. Clone the repository

```bash
git clone https://github.com/james-salafatinos/wExplore.git
```

2. Change the working directory

```bash
cd wExplore
```

3. Install dependencies

```bash
npm install
pip install pandas numpy fa2 networkx
```

**Virtual environment wont work because of `fa2` requires C++ Build tools**

4. Run the app

```bash
npm start
```

🌟 You are all set!

## 🍰 Contributing

## 💻 Built with

- [OII Network Visualization](https://github.com/oxfordinternetinstitute/InteractiveVis/): for network config
- [Sigma.js] for network renderer
- [MongoDB]
- [Node.js]
- [Express.js]
- [GCP]

## 🙇 Special Thanks

## Todo

- [-] Implement loading screen / loading wheel after new graph submit
- [x] Implement initial "library" of submitted nodes for the user to browse (i.e., a list of network titles (John Church) a user can initially click into and browse instantly)
- [-] Fix ability to refresh after a new graph submittal without worrying about re-submitting
- [] Handle the timeout error that may happen when way too many Wikipedia API requests are called
- [] Implement error handling / messaging to user (i.e., That was too large of a graph, sorry.)
- [x] Implement ability to click on node and it opens a tab / a button that appears to go to wikipedia
- [] Implement doc linking to mitigate MongoDB 16mb limit
- [] Implement option to have user control some visual parameters

## Issues

- [] MongoDB Doc size limit
