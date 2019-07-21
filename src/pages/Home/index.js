import React from "react";

// antd-mobile的使用
// import { Button } from 'antd-mobile';
// ReactDOM.render(<Button>Start</Button>, mountNode);
// 导入路由
import { Route } from "react-router-dom";
// 导入路由
import Index from "../Index";
import HouseList from "../HouseList";
import News from "../News";
import Profile from "../Profile";

// 导入标签页
import { TabBar } from "antd-mobile";

// 导入样式
import "./index.css";

// 子菜单项数据
const menuList = [
  { title: "首页", icon: "icon-ind", url: "/home" },
  { title: "找房", icon: "icon-findHouse", url: "/home/list" },
  { title: "资讯", icon: "icon-infom", url: "/home/news" },
  { title: "我的", icon: "icon-my", url: "/home/profile" }
];

export default class Home extends React.Component {
  // selectedTab 表示点击，图标选中
  // hidden 表示是否隐藏tabbar标签栏
  // fullScreen 表示是否全屏显示,同时影响其高度
  state = {
    selectedTab: this.props.location.pathname,
    hidden: false,
    fullScreen: true
  };

  renderContent = () => {
    // 箭头函数，由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号
    // 直接返回的是对象
    return menuList.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.url}
        onPress={() => {
          this.props.history.push(item.url);
          this.setState({
            selectedTab: item.url
          });
        }}
      />
    ));
  };

  render() {
    // console.log(this.props);
    return (
      <div className="home">
        {/* 路由嵌套，嵌套子路由 */}
        {/* 子路由的path以父路由的path开头即可 
          1.默认重定向路由为/，时 对应的就是Index组件
          2.精确匹配，避免模糊匹配，造成每个页面都是/
        */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />

        {/* 
        tintColor  选中的字体颜色
        badge  徽章
         */}
        <div className="tabbar">
          {/* 
          unselectedTintColor	未选中的字体颜色
          tintColor	选中的字体颜色
          barTintColor	tabbar 背景色	
           */}
          <TabBar tintColor="#21b97a" hidden={this.state.hidden}>
            {/* 
          onPress:点击图标时触发 ----》高亮并跳转
           */}
            {/* 调用函数 */}
            {this.renderContent()}
          </TabBar>
        </div>
      </div>
    );
  }
}
