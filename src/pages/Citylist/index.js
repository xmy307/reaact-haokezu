import React from "react";

// 导入ant
import { Toast } from "antd-mobile";

// 针对项目要呈现的结构，选定对应的视图，并结构、导入react-virtualized 组件
import { List, AutoSizer } from "react-virtualized";

// 导入axios
import axios from "axios";

// 导入scss
import "./index.scss";

// 导入获取城市定位的方法
import { getCurrentCity, setCity } from "../../utils";

import NavHeader from "../../components/NavHeader";

// 封装一个函数专门用来处理城市列表数据
// 对数据进行处理：1.对象List:{a:[],b:[]...}；2.数组：Name:['a','b'...]
const selectCity = array => {
  // 创建一个对象List
  const cityInfo = {};
  // 遍历整个数组(通过接口传进来的参数)，得到每个item中的short
  array.forEach(item => {
    // 处理数据，拿到城市信息
    // 处理首字母（索引）,拿到首字母
    // 字符串截取:substr()、slice(值1，值2)、substring(值1，值2)不包含值2
    const firstLetter = item.short.substr(0, 1);
    // 将对象List与遍历的数组比较

    // for为遍历对象的语法，if判断对象的语法？？？in返回值为true或false
    // 对short中的第一个字母进行判断，是否List中有这个键，没有则push该键以及值，有则直接将值存储到对应的键值对中
    if (firstLetter in cityInfo) {
      // 如果存在该key，则直接将value添加到对应的键值中
      cityInfo[firstLetter].push(item);
    } else {
      // 如果不存在，则添加key属性,并将对应的value值存储到对应的数组中
      cityInfo[firstLetter] = [item];
      // console.log(cityInfo);
    }
  });

  // 拿到字母数据，获取城市索引
  // Object.keys(obj) 作用：获取对象中所有的键，并且放到一个数组中返回
  const citySort = Object.keys(cityInfo).sort();
  // console.log(citySort);
  // 必须要返回，才能打印citySort的结果
  return {
    cityInfo,
    citySort
  };
};

// 数据源list
// const list = Array.from(new Array(10000)).map(
//   (item, index) => `${index}-react-virtualized组件列表项`
// );

// 封装一个函数专门用来处理城市列表索引的名称
const handelCityIndex = letter => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};

// 索引高度
const INDEX_HEIGHT = 36;
// 城市名称高度
const CITY_HEIGHT = 50;

// 有数据的城市列表
const CITY_HAS_HOUSE = ["北京", "上海", "广州", "深圳"];

export default class cityList extends React.Component {
  state = {
    cityInfo: {},
    // 城市索引列表
    citySort: [],
    activeLight: 0
  };

  // 创建refs对象，用来获取react-virtualized插件中List组件实例
  // Refs 是使用 React.createRef() 创建的，并通过 ref 属性附加到 React 元素。在构造组件时，通常将 Refs 分配给实例属性，以便可以在整个组件中引用它们。所以拿值同state this.listRef
  listRef = React.createRef();

  async componentDidMount() {
    await this.allCityInfo();

    // 因为this.allCityInfo()是异步操作，所以数据没拿完，无法计算数据的渲染列表后的高度
    // measureAllRows() 提前计算每一行的高度
    // 解决：1.componentDidMount() this.allCityInfo()添加async、await
    // 解决：2.在allCityInfo()函数中，获取到数据之后，再添加该方法
    this.listRef.current.measureAllRows();
  }

  // 拿到所有的城市信息
  async allCityInfo() {
    const res = await axios.get("http://localhost:8080/area/city?level=1");
    // console.log(res);

    // cityInfo是城市列表数据  citySort是城市字母排序
    const { cityInfo, citySort } = selectCity(res.data.body);

    // 获取热门城市列表
    const hotCity = await axios.get("http://localhost:8080/area/hot");
    // console.log(hotCity);

    // 在citySort数组中添加一个hot字符串作为索引项，添加至前面
    citySort.unshift("hot");
    // 在cityInfo对象中添加hot的key值，并将请求中拿到的数据赋值给key，添加至前面
    cityInfo["hot"] = hotCity.data.body;

    // 方法一：通过callback回调函数的方法，拿到定位的城市信息
    // 传递一个回调函数进去
    // const currentCity = getCurrentCity((label, value) => {
    //   console.log(label, value);
    // });
    // console.log(cityInfo, citySort, currentCity);

    // 方法二
    const currentCity = await getCurrentCity();
    citySort.unshift("#");
    cityInfo["#"] = [currentCity];

    // console.log(cityInfo, citySort);

    // 修改setState
    this.setState(
      {
        cityInfo,
        citySort
      }
      // 方法2：
      // () => {
      //   this.listRef.current.measureAllRows();
      // }
    );
  }

  // 渲染城市数据列表
  rowRenderer = ({
    key, // 每一项的唯一标识
    index, // 每一行的索引号
    style // Style object to be applied to row (to position it)
  }) => {
    const { cityInfo, citySort } = this.state;
    // 字母索引列表
    const letter = citySort[index];
    // console.log(letter);
    // 字母索引对应的城市列表
    const list = cityInfo[letter];
    // console.log(list);

    // 注意：千万不要忘记给每一行元素设置 style 样式，来动态指定虚拟列表中的位置
    return (
      <div key={key} style={style} className="city">
        <div className="title">{handelCityIndex(letter)}</div>
        {list.map(item => (
          <div
            key={item.value}
            className="name"
            onClick={() => {
              this.changeCity(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  // 切换当前城市列表
  changeCity = ({ label, value }) => {
    // console.log(label, value);
    // arr.indexOf(value)>-1 判断arr中是否存在某个值 ===-1则表示不存在
    if (CITY_HAS_HOUSE.indexOf(label) > -1) {
      setCity({ label, value });
      this.props.history.go(-1);
    } else {
      // console.log("无房源");
      Toast.info("该城市暂无房源数据", 1);
    }
  };

  // 计算高度
  // 返回给定索引的行高度的函数,解构index得到小标
  computeRowHeight = ({ index }) => {
    // console.log(index);
    const { cityInfo, citySort } = this.state;

    // 城索引列表
    const letter = citySort[index];
    // console.log(letter);
    // 城市名称列表
    const list = cityInfo[letter];

    return INDEX_HEIGHT + CITY_HEIGHT * list.length;
  };

  // 渲染城市索引列表
  renderCityIndex = () => {
    const { activeLight, citySort } = this.state;

    return citySort.map((item, index) => (
      <li
        className="indexName"
        key={item}
        // 当点击的时候才调用该函数，不是一进来就执行，所以要包裹在一个函数中调用
        onClick={() => this.getToCurrentCity(index)}
      >
        <span className={index === activeLight ? "heightLight" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  };

  //公共方法的调用：公共方法就是组件内部的实例方法，所以需要先拿到组件内部的实例才能调用，而实例是通过ref调用拿到的
  // react获取组件的实例
  // 1.直接new Component()
  // 2.ReactDOM.render返回组件实例(React新版本已失效，返回null)
  // 3.ref回调函数返回组件实例(React新版本可用)
  getToCurrentCity = index => {
    // console.log("点击拿到当前索引", index, this.listRef);
    // 访问 Refs  当 ref 被传递给 render 中的元素时，对该节点的引用可以在 ref 的 current 属性中被访问。
    // 当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性
    // 通过城市索引，跳转至对应的行
    // 通过List组件实例中提供的方法scrollToRow(),来实现切换城市列表功能，但scrollToRow要求跳转的哪一行必须渲染过，但因为列表很长，后面的行是不会直接被渲染的，这就导致后面的行跳转是不准确的
    // 解决：1.用户手动滚动一遍 2.调用List组件中的measureAllRows()方法，提前计算高度
    this.listRef.current.scrollToRow(index);
  };

  // List组件滚动时，触发该方法
  onRowsRendered = ({ startIndex }) => {
    const { activeLight } = this.state;
    if (startIndex !== activeLight) {
      this.setState({
        activeLight: startIndex
      });
    }

    // console.log(startIndex);
  };

  render() {
    return (
      <div className="citylist">
        {/* <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar> */}
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              width={width}
              height={height}
              // 必须是数组的长度 字母索引的长度
              rowCount={this.state.citySort.length}
              // 动态计算出的高度,rowHeight为函数时，其解构的索引index是rowCount中数组对应下标的值
              rowHeight={this.computeRowHeight}
              // 动态渲染城市列表
              rowRenderer={this.rowRenderer}
              // 与rowRenderer相互绑定，从中获得到handelCityIndex的索引值
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        <ul className="indexList">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
