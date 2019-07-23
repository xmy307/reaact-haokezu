import React from "react";

import "./index.scss";

const BMap = window.BMap;

export default class Map extends React.Component {
  componentDidMount() {
    // 创建百度地图对象
    const map = new BMap.Map("container");

    // 设置中心点坐标
    const point = new BMap.Point(121.61833152747242, 31.040108832402957);

    // 使用中心点设置地图初始化以及地图展示的缩放大小
    map.centerAndZoom(point, 18);
  }

  render() {
    return (
      <div className="map">
        <div id="container" className="container" />
      </div>
    );
  }
}
