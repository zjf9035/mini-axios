import React from "react";
import axios from "axios";

function App() {
  axios.interceptors.request.use(function (config) {
    return config;
  });
  return <div className="App">App 页面</div>;
}

export default App;
