import React from "react";

import { Flex } from "antd-mobile";
// 导入组件
import SearchHeader from "../../components/SearchHeader";

// 导入scss
import styles from "./index.module.scss";

// 导入组件
import Filter from "./components/Filter";

// 导入api
import { API, getCurrentCity } from "../../utils";

export default class HouseList extends React.Component {
  // 初始化数据filters，后面还要添加定位
  filters = {};

  state = {
    list: [],
    count: 0
  };

  onFilter = filters => {
    this.filters = filters;
    // console.log(filters);
    // 操作筛选条件时，触发
    this.searchHouseList();
  };

  componentDidMount() {
    this.searchHouseList();
  }

  // 获取房屋列表数据
  async searchHouseList() {
    const { value } = await getCurrentCity;
    const res = await API.get("houses", {
      params: {
        ...this.filters,
        cityId: value,
        start: 1,
        end: 20
      }
    });

    const { list, count } = res.data.body;
    this.setState({
      list,
      count
    });
  }

  render() {
    return (
      <div className={styles.search}>
        <Flex className={styles.listHeader}>
          <i className="iconfont icon-back" />
          <SearchHeader cityName="上海" className={styles.listSearch} />
        </Flex>
        <Filter onFilter={this.onFilter} />
      </div>
    );
  }
}
