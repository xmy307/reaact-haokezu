import React from "react";

// 导入ant组件中navbar
import { NavBar } from "antd-mobile";
// 导入scss
import "./index.scss";

// 导入校验

// 导入withRouter高阶组件，非路由也可使用props，此时才能获取 this.props,包含（history, match, location）三个对象；如果不使用该高阶组件，无法获取history, match, location）三个对象，只能获取children对象，下面传props参数的例子就是
import { withRouter } from "react-router-dom";

// props中的children属性一般用于封装公共组件中（笔记中：props深入）
// function NavHeader(props) {
//   console.log(props);

function NavHeader({ children, history }) {
  // console.log(children, history);
  return (
    <NavBar
      className="navbar"
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => history.go(-1)}
    >
      {children}
    </NavBar>
  );
}

// 校验children必须是字符串

// 将组件withRouter一下
export default withRouter(NavHeader);
// export default NavHeader;
