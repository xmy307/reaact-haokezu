import React from "react";

import { Flex } from "antd-mobile";

// 导入scss
import styles from "./index.module.scss";

//导入高阶组件
import { withRouter } from "react-router-dom";

// 组件接收一个参数cityName
// {cityName}是难点
function SearchHeader({ cityName, history, className }) {
  // console.log(cityName);
  return (
    <div className={[styles.search, className].join(" ")}>
      <Flex justify="between">
        <div className={styles.searchInpt}>
          <Flex>
            <div
              className={styles.location}
              onClick={() => history.push("/citylist")}
            >
              {/* 难点 */}
              <span>{cityName}</span>
              <i className="iconfont icon-arrow" />
            </div>

            <div
              className={styles.searchIcon}
              onClick={() => history.push("/search")}
            >
              <i className="iconfont icon-seach" />
              请输入小区或地址
            </div>
          </Flex>
        </div>

        <div className="icon" onClick={() => history.push("/map")}>
          <i className="iconfont icon-map" />
        </div>
      </Flex>
    </div>
  );
}

export default withRouter(SearchHeader);
