import React from "react";
import ReactDOM from "react-dom";

// 导入antd-mobile的样式文件
import "antd-mobile/dist/antd-mobile.css";

// 导入全局样式
import "./index.css";

// 导入根组件
import App from "./App";

// 导入长列表virtualized 组件库的样式
import "react-virtualized/styles.css";

// 引入字体样式
import "./assets/fonts/iconfont.css";

// 渲染根组件
ReactDOM.render(<App />, document.getElementById("root"));
