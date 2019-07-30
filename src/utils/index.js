// 仅封装当前定位的城市数据
// 通过callback将if中不为true的值传递出去
// utils--index.js --> new Promise--index.js

// 异步请求中存在方法try..catch   而try中拿到的就是Promise请求中的resolve的结果，而catch拿到的就是catch中的reject结果  try...catch是可省略的  try获取数据成功，catch获取数据失败

import axios from "axios";
import { getCity, setCity } from "./city";

const BMap = window.BMap;

const getCurrentCity = () => {
  // const currentCity = localStorage.getItem("hkzf_city");
  const currentCity = getCity();

  if (!currentCity) {
    // 返回该方法
    return new Promise(resolve => {
      // 在一个异步的结果中返回一个内容，同步的可以通过return返回一个内容，return仅针对的是回调函数（axios数据请求）的结果，针对的不是整个方法（if(!currentCity)）的返回结果
      const myCity = new BMap.LocalCity();
      myCity.get(async result => {
        const cityName = result.name;
        // 通过接口换取我们接口中的房源信息
        const res = await axios.get("http://localhost:8080/area/info", {
          params: {
            name: cityName
          }
        });

        const { label, value } = res.data.body;
        // 拿到数据，使用resolve暴露出去，resolve中拿到的是一个对象
        resolve({ label, value });

        // localStorage.setItem("hkz_city", JSON.stringify({ label, value }));
        setCity({ label, value });
      });
    });
  } else {
    // 返回一个状态由给定value决定的Promise对象
    // currentCity表示Promise 内部resolve(currentCity)的参数
    // Promise.resolve(currentCity)的结果就是currentCity的值
    return Promise.resolve(currentCity);
  }
};

export { getCurrentCity, getCity, setCity };

// 导入 url，然后再导出
export { BASE_URL } from "./url";
// 导入 API，并导入
export { API } from "./api";
