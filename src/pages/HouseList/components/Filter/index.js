import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";

// 导入API
import { API, getCurrentCity } from "../../../../utils";

// 父传子，将数据信息传递给子组件
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
};

export default class Filter extends Component {
  state = {
    // 点击高亮
    titleSelectedStatus,
    // 显示或隐藏选择器状态
    openType: "",
    filtersData: {}
  };

  componentDidMount() {
    this.getFilterPicker();
  }

  async getFilterPicker() {
    // 需要传递一个value值
    const { value } = await getCurrentCity();
    const res = await API.get("/houses/condition", {
      params: {
        id: value
      }
    });

    // console.log(res);
    this.setState({
      filtersData: res.data.body
    });
  }

  // 切换高亮
  // 子传父，一进来就会渲染，默认不选中，所以不能直接修改原数据
  changeLighted = type => {
    this.setState({
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [type]: true
      },
      openType: type
    });
  };

  // 保存数据对话框
  onSave = () => {
    this.setState({
      openType: ""
    });
  };
  // 隐藏对话框
  onCancel = () => {
    this.setState({
      openType: ""
    });
  };

  // 渲染前面三个菜单对应的组件
  // titleSelectedStatus={area: false,mode: false,}
  // openType="area"
  // 从filterData中获取数据
  // area: area=>{}  subway: subway=>{}
  // mode: rentType=[]
  // price: price=[]
  renderFilterPicker() {
    // 判断openType是否是前三个菜单对应的组件
    const {
      openType,
      filtersData: { area, subway, rentType, price }
    } = this.state;
    if (openType === "more" || openType === null) return null;

    // 定义一个变量接收渲染时对应的数据处理
    let data;
    switch (openType) {
      case "area":
        data = [area, subway];
        break;
      case "mode":
        data = rentType;
        break;
      case "price":
        data = price;
        break;
      default:
        break;
    }

    // return ()
  }

  render() {
    const { titleSelectedStatus, openType } = this.state;

    return (
      <>
        <div className={styles.root}>
          {openType === "area" ||
          openType === "mode" ||
          openType === "price" ? (
            //  前三个菜单的遮罩层   点击遮罩层，遮罩层隐藏

            <div className={styles.mask} onClick={this.onCancel} />
          ) : null}

          <div className={styles.content}>
            {/* 标题栏 */}
            {/* 
              1.渲染标题并传递高亮的数据是   父传子 
              2.注册点击事件，改变对应的高亮是对应的  子传父
            */}
            <FilterTitle
              titleSelectedStatus={titleSelectedStatus}
              onClick={this.changeLighted}
            />

            {openType === "area" ||
            openType === "mode" ||
            openType === "price" ? (
              // {/* 前三个菜单对应的内容： */}
              <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
            ) : null}

            {/* 最后一个菜单对应的内容： */}
            {/* <FilterMore /> */}
          </div>
        </div>
      </>
    );
  }
}
