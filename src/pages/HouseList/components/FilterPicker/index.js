import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter";

export default class FilterPicker extends Component {
  //方法一：

  // 将数据defaultValue通过 props 传递给 FilterPicker 组件
  // 每次重新打开窗口一定会走组件挂载阶段
  // 初始化阶段
  // constructor(props) {
  //   super(props);
  //   // console.log("FilterPicker接收到的值为：", this.props.defaultValue);
  //   this.state = {
  //     // value用来获取选中的值
  //     value: this.props.defaultValue
  //   };
  // }

  // 更新阶段
  // componentDidUpdate(prevProps) {
  //   // console.log("更新了");
  //   // console.log("上一次和本次相比较", prevProps, this.props);
  //   // 不相等，说明标题发生了切换
  //   if (this.props.defaultValue !== prevProps.defaultValue) {
  //     this.setState({
  //       value: this.props.defaultValue
  //     });
  //   }
  // }

  state = {
    // value用来获取选中的值
    value: this.props.defaultValue
  };

  onChange = val => {
    // console.log("选中值", val);
    this.setState({
      value: val
    });
  };

  render() {
    // 从父组件中传递过来的数据
    const { onSave, onCancel, data, cols, type } = this.props;
    const { value } = this.state;
    // console.log("这是fp组件：", onSave, onCancel);
    return (
      <>
        {/* 
        选择器组件： data表示数据源
        1.添加value  对应的是当前数据的层级，即默认选中项的值
        2.	onChange  选中后的回调，可使用rc-form  (val): void   (val)表示回调函数的参数，void 表示有返回值
        */}
        <PickerView
          data={data}
          value={value}
          onChange={this.onChange}
          cols={cols}
        />

        {/* 底部按钮     再传递到子组件中*/}
        <FilterFooter
          onCancel={() => {
            onCancel(type);
          }}
          onSave={() => {
            onSave(type, value);
          }}
        />
      </>
    );
  }
}
