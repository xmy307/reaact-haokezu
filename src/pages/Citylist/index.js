import React from "react";

// 导入ant
import { NavBar } from "antd-mobile";

// 针对项目要呈现的结构，选定对应的视图，并结构、导入react-virtualized 组件
import { List } from "react-virtualized";

// 导入axios
import axios from "axios";

// 导入scss
import "./index.css";

// 导入获取城市定位的方法
import { getCurrentCity } from "../../utils";

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
const list = Array.from(
  new Array(10000).map((item, index) => `${index}-react-virtualized组件列表项`)
);

function rowRenderer({
  key, // 每一项的唯一标识
  index, // 每一行的索引号
  isScrolling, // 表示当前行是否正在滚动，如果是滚动结果为true；否则，为false
  isVisible, // 当前列表项是否可见
  style // Style object to be applied to row (to position it)
}) {
  // 注意：千万不要忘记给每一行元素设置 style 样式，来动态指定虚拟列表中的位置
  return (
    <div key={key} style={style}>
      {/*  list[index]拿到list数据中对应下标的值*/}
      {list[index]} --- {isScrolling + ""} --- {isVisible + ""}
    </div>
  );
}

export default class cityList extends React.Component {
  state = {
    cityInfo: {},
    // 城市索引列表
    citySort: []
  };

  componentDidMount() {
    this.allCityInfo();
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
    this.setState({
      cityInfo,
      citySort
    });
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => console.log("onLeftClick")}
        >
          城市选择
        </NavBar>
        {/* 城市列表 */}
        <List
          width={300}
          height={300}
          rowCount={list.length}
          rowHeight={20}
          rowRenderer={rowRenderer}
        />
      </div>
    );
  }
}
