// 仅封装当前定位的城市数据
// 通过callback将if中不为true的值传递出去
// utils--index.js --> Citylist--index.js

import axios from "axios";

const BMap = window.BMap;

// getCurrentCity函数要返回一个值，但内部是异步操作，现在需要在if中返回一个结果，不能通过return返回，return返回的是同步的必须得通过promise异步返回数据
const getCurrentCity = callback => {
  /*
  1.判断localStorage中是否有定位的城市，从localStorage中拿本地存储信息，看本地存储中是否有定位的城市
  2.如果没有，就使用首页中获取定位城市的代码来获取，并且存储到本地缓存中，然后返回该城市数据
  3.如果有，直接返回本地存储中的城市数据
   */

  // Promise 对象用于表示一个异步操作的最终状态（完成或失败），以及该异步操作的结果值。
  // 异步中调用try{...}catch(e){...}

  /**
   * 目前学到的解决异步操作的两种方式
   * 1.callback回调函数：等待数据获取完毕，调用回调函数，把获取到的值暴露出去
   * 2.通过Promise解决
   */

  const currentCity = localStorage.getItem("hkzf_city");

  if (!currentCity) {
    // return new Promise(resolve => {
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

      // try中获取到的数据
      const { label, value } = res.data.body;

      // 拿到数据后，调用回调函数，通过参数，将label和value传递/暴露出去
      callback(label, value);

      // resolve({ label, value });
      localStorage.setItem("hkz_city", JSON.stringify({ label, value }));
    });
    // });
  } else {
    // 返回一个状态由给定value决定的Promise对象
    // Promise.resolve(currentCity)的结果就是currentCity的值
    return Promise.resolve(currentCity);
  }
};

export { getCurrentCity };
