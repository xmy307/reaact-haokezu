import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";

// 导入API
import { API, getCurrentCity } from "../../../../utils";

// 标题高亮数据    父传子，将数据信息传递给子组件
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
};

// 设置默认选中状态值
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: []
};
export default class Filter extends Component {
  state = {
    // 点击高亮
    titleSelectedStatus,
    // 显示或隐藏选择器状态 mode
    openType: "",
    filtersData: {},
    selectedValues
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

  // 封装标题高亮逻辑
  getTitleSelectedStatus(type, selectVal) {
    // newTitleSelectedStatus对象里面仅只有一个属性
    const newTitleSelectedStatus = {};
    if (
      // 否则，分别判断是否与默认值相同,不相同则选中了
      type === "area" &&
      (selectVal.length === 3 || selectVal[0] === "subway")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectVal.length !== 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    return newTitleSelectedStatus;
  }

  // 切换高亮
  // 子传父，一进来就会渲染，默认不选中，所以不能直接修改原数据
  changeLighted = type => {
    const { titleSelectedStatus, selectedValues } = this.state;
    // 根据标题的选中状态对象，获取一个新的标题选中状态
    // 不修改原来的状态下，重新操作数据，定义一个新对象
    const newTitleSelectedStatus = {
      ...titleSelectedStatus
    };

    // 拿到标题选中状态中的键并遍历
    // Object.keys(titleSelectedStatus)=>['area','mode','price','more']
    Object.keys(titleSelectedStatus).forEach(key => {
      // console.log(key);
      // 获取到每一个菜单选中项的默认值
      const selectVal = selectedValues[key];
      // 是否与当前选中值相同
      if (key === type) {
        newTitleSelectedStatus[type] = true;
      } else {
        // wlse if (
        //   // 否则，分别判断是否与默认值相同,不相同则选中了
        //   key === "area" &&
        //   (selectVal.length === 3 || selectVal[0] === "subway")
        // ) {
        //   newTitleSelectedStatus[key] = true;
        // } else if (key === "mode" && selectVal[0] !== "null") {
        //   newTitleSelectedStatus[key] = true;
        // } else if (key === "price" && selectVal[0] !== "null") {
        //   newTitleSelectedStatus[key] = true;
        // } else {
        //   newTitleSelectedStatus[key] = false;
        // }
        const typeSelected = this.getTitleSelectedStatus(key, selectVal);
        // 将typeSelected对象中的属性，添加到newTitleSelectedStatus，重名的属性，后面的覆盖前面的
        Object.assign(newTitleSelectedStatus, typeSelected);
      }
    });

    // console.log(newTitleSelectedStatus);

    this.setState({
      // titleSelectedStatus: {
      //   ...this.state.titleSelectedStatus,
      //   [type]: true
      // },
      // 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatus
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    });
  };

  // 保存数据对话框
  //type是当前标题选中的对应值  value为当前筛选器选中的最新值
  onSave = (type, value) => {
    // console.log("Filter组件中获得选中的type和value值：", type, value);
    const { titleSelectedStatus } = this.state;
    // const newTitleSelectedStatus = {
    //   ...titleSelectedStatus
    // };

    const newTitleSelectedStatus = this.getTitleSelectedStatus(type, value);
    // if (
    //   // 否则，分别判断是否与默认值相同,不相同则选中了
    //   type === "area" &&
    //   (value.length === 3 || value[0] === "subway")
    // ) {
    //   newTitleSelectedStatus[type] = true;
    // } else if (type === "mode" && value[0] !== "null") {
    //   newTitleSelectedStatus[type] = true;
    // } else if (type === "price" && value[0] !== "null") {
    //   newTitleSelectedStatus[type] = true;
    // } else {
    //   newTitleSelectedStatus[type] = false;
    // }
    // console.log(newTitleSelectedStatus);

    // 拿到数据
    const newSelectedValue = {
      ...this.state.selectedValues,
      [type]: value
    };

    // 处理拿到的数据，将数据作为请求的参数，该数据是个对象，数据格式为:
    // {area: 'AREA|67fad918-f2f8-59df', // 或 subway: '...';rentType: 'true', // 或 'null';price: 'PRICE|2000',;more: 'ORIEN|80795f1a-e32f-feb9,ROOM|d4a692e4-a177-37fd'}
    // 传给父组件的筛选条件对象
    const filters = {};
    // 要想拿到newSelectedValue中的每个属性对应的值，需要遍历
    // Object.keys(newSelectedValue).forEach(key => {
    // 1.area还是subway，获取数组中的第一个元素；一项一项的去处理即可，无需遍历
    const area = newSelectedValue.area;
    const areaKey = area[0];
    // 2.若是area，判断area的长度，长度为2，则获取值为null；若area的长度为3，则判断数组的第三个元素是否是null，如果是null，则获取值为数组的第二个元素，否则为第三个元素
    let areaValue;
    if (area.length === 2) {
      areaValue = "null";
    } else if (area.length === 3) {
      areaValue = area[2] === "null" ? area[1] : area[2];
    }
    filters[areaKey] = areaValue;
    // });

    // 3.处理方式、租金，获取数组的第一个值
    filters.rentType = newSelectedValue.mode[0];
    filters.price = newSelectedValue.price[0];

    // 4.处理更多筛选 ，获取more的所有选中项，并转为字符串格式，添加一个，
    filters.more = newSelectedValue.more.join(",");

    // 调用父组件，将filters作为形参传递给父组件
    this.props.onFilter(filters);
    // console.log("最新筛选到的值:", newSelectedValue, filters);

    this.setState({
      openType: "",
      titleSelectedStatus: {
        ...titleSelectedStatus,
        ...newTitleSelectedStatus
      },
      // 更新当前对应的选中值
      selectedValues: newSelectedValue
    });
  };

  // 隐藏对话框
  onCancel = type => {
    // console.log(type);
    const { titleSelectedStatus, selectedValues } = this.state;
    // const newTitleSelectedStatus = {
    //   ...titleSelectedStatus
    // };

    const selectVal = selectedValues[type];

    const newTitleSelectedStatus = this.getTitleSelectedStatus(type, selectVal);
    // console.log(newTitleSelectedStatus);

    this.setState({
      openType: "",
      titleSelectedStatus: {
        ...titleSelectedStatus,
        ...newTitleSelectedStatus
      }
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
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state;
    // 判断openType是否是前三个菜单对应的组件
    if (openType === "more" || openType === "") {
      return null;
    }

    // 定义一个变量接收数据
    let data;
    let cols = 1;

    // 当前选中值
    let defaultValue = selectedValues[openType];
    // ant库中要求PickerView选择器组件的数据必须是数组
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
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

    return (
      // {/* 前三个菜单对应的内容： */}
      <FilterPicker
        key={openType}
        data={data}
        cols={cols}
        onCancel={this.onCancel}
        onSave={this.onSave}
        type={openType}
        defaultValue={defaultValue}
      />
    );
  }

  //渲染 第四个菜单对应的组件
  renderFilterMore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues
    } = this.state;

    if (openType !== "more") return null;
    const data = { roomType, oriented, floor, characteristic };

    // 设置上一次的默认选中值
    let defaultVaule = selectedValues.more;
    // console.log(defaultVaule);

    return (
      <FilterMore
        data={data}
        type={openType}
        defaultVaule={defaultVaule}
        onCancel={this.onCancel}
        onSave={this.onSave}
      />
    );
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

            {this.renderFilterPicker()}
            {/* 最后一个菜单对应的内容： */}
            {this.renderFilterMore()}
          </div>
        </div>
      </>
    );
  }
}
