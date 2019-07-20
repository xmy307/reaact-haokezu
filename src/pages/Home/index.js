import React from "react";

import { Route } from "react-router-dom";

// 导入路由
import Index from "../Index";
import HouseList from "../HouseList";
import News from "../News";
import Profile from "../Profile";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>这是Home页面</h1>

        {/* 路由嵌套，嵌套子路由 */}
        {/* 子路由的path以父路由的path开头即可 */}
        <Route path="/home/index" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />
      </div>
    );
  }
}
