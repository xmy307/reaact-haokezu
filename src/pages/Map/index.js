import React from "react";

import "./index.scss";

// 导入公共组件头部
import NavHeader from "../../components/NavHeader";

// 导入当前定位方法
import { getCurrentCity } from "../../utils";

// 导入
import styles from "./index.module.css";

const labelStyle = {
  cursor: "point",
  border: "0px solid rgb(255,0,0)",
  padding: "0px",
  whiteSpace: "nowrap",
  color: "rgb(255, 255, 255)",
  textAlign: "center"
};

const BMap = window.BMap;

export default class Map extends React.Component {
  componentDidMount() {
    this.initMap();
  }

  async initMap() {
    const { label } = await getCurrentCity();
    console.log("当前定位城市为:", label);

    // 创建百度地图对象
    // 参数：表示地图容器的id值
    const map = new BMap.Map("container");
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          map.centerAndZoom(point, 11);

          // // 添加两个控件
          // 创建一个特定样式的地图平移缩放控件
          map.addControl(new BMap.NavigationControl());
          // 添加一个比例尺控件
          map.addControl(new BMap.ScaleControl());

          // 添加文字标签
          var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-30, -30) //设置文本偏移量
          };

          // 覆盖物
          var label = new BMap.Label("上海39期", opts); // 创建文本标注对象

          // 设置房源覆盖物的html信息---区和镇的覆盖物
          label.setContent(`
              <div class="${styles.bubble}">
                <p class="${styles.name}">航头</p>
                <p>388套</p>
              </div>
            `);
          label.setStyle(labelStyle);
          map.addOverlay(label);
        }
      },
      label
    );
  }

  render() {
    return (
      <div className="map">
        <div className="container">
          <NavHeader>地图找房</NavHeader>
          <div id="container" className="container" />
        </div>
      </div>
    );
  }
}
