import React from "react";

import { Flex } from "antd-mobile";
// 导入组件
import SearchHeader from "../../components/SearchHeader";

// 导入scss
import styles from "./index.module.scss";

// 导入组件
import Filter from "./components/Filter";

export default class HouseList extends React.Component {
  render() {
    return (
      <div className={styles.search}>
        <Flex className={styles.listHeader}>
          <i className="iconfont icon-back" />
          <SearchHeader cityName="上海" className={styles.listSearch} />
        </Flex>
        <Filter />
      </div>
    );
  }
}
