// 导入路由，专门存放路由
import React from "react";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// 导入页面组件
import Home from "./pages/Home";
import Citylist from "./pages/Citylist";
import Map from "./pages/Map";

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/citylist">城市选择</Link>
          </li>
        </ul> */}

        {/* 给home添加重定向 */}
        <Route exact path="/" render={() => <Redirect to="/home" />} />

        {/* 首页  外层路由，用来渲染整个Home页面 */}
        <Route path="/home" component={Home} />

        {/* 城市选择页面 */}
        <Route path="/citylist" component={Citylist} />

        <Route path="/map" component={Map} />
      </div>
    </Router>
  );
};

export default App;
