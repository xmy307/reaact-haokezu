import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    // 表示默认选中项的值,原为空数组
    selectedValues: this.props.defaultVaule
  };

  // 点击触发选中项
  handleChange(id) {
    // 获取当前选中项的值
    // console.log(id);
    const { selectedValues } = this.state;
    // selectedValues中仅存储对应属性more的数组，所以不能在原数组的基础上修改
    let newSelectedValues = [...selectedValues];
    // 判断选中项中是否有当前选中项的值，如果有，则移除该值；否则添加到selectedValues中
    if (selectedValues.indexOf(id) > -1) {
      // const index = newSelectedValues.findIndex(item => item === id);
      // newSelectedValues.splice(index, 1);
      newSelectedValues = newSelectedValues.filter(item => item !== id);
    } else {
      newSelectedValues.push(id);
    }

    // console.log(newSelectedValues);
    this.setState({
      selectedValues: newSelectedValues
    });
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const { selectedValues } = this.state;
      const isSelected = selectedValues.indexOf(item.value) > -1;

      return (
        <span
          key={item.value}
          //  styles.tagActive高亮类名
          className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")}
          //此处使用箭头函数，因为存在this指向问题
          onClick={() => this.handleChange(item.value)}
        >
          {item.label}
        </span>
      );
    });
  }

  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      type,
      onSave,
      onCancel
    } = this.props;
    const { selectedValues } = this.state;
    // console.log(roomType, oriented, floor, characteristic);
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div
          className={styles.mask}
          onClick={() => {
            onCancel(type);
          }}
        />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={() => this.setState({ selectedValues: [] })}
          onSave={() => onSave(type, selectedValues)}
        />
      </div>
    );
  }
}
