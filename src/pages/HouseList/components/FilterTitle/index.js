import React from "react";

import { Flex } from "antd-mobile";

import styles from "./index.module.css";

// 条件筛选栏标题数组：
const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" }
];

export default function FilterTitle({ titleSelectedStatus, onClick }) {
  // console.log(titleSelectedStatus, onClick);
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map(item => {
        // 拿到父组件中对应的高亮的值
        const isSelected = titleSelectedStatus[item.type];
        return (
          // 第二个onClick事件为调用父组件中的点击事件，子组件将数据作为参数返回
          <Flex.Item key={item.type} onClick={() => onClick(item.type)}>
            {/* 选中类名： selected */}
            <span
              className={[
                styles.dropdown,
                isSelected ? styles.selected : ""
              ].join(" ")}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        );
      })}
    </Flex>
  );
}