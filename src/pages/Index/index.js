import React from "react";

// 导入走马灯组件
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";

// 导入路由
import { Link } from "react-router-dom";

// 导入scss
import "./index.scss";

// 导入axios
import axios from "axios";

// 导入图片
import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";

const BMap = window.BMap;

// const PlaceHolder = ({ className = "", ...restProps }) => (
//   <div className={`${className}placeholder`} {...restProps} />
// );

// 封装房屋信息导航
const houseInfo = [
  { title: "整租", src: nav1, url: "/home/list" },
  { title: "合租", src: nav2, url: "/home/list" },
  { title: "地图找房", src: nav3, url: "/home/list" },
  { title: "去出租", src: nav4, url: "/home/list" }
];

// 租房小组
// const data = Array.from(new Array(4)).map((_val, i) => ({
//   text: `name${i}`
// }));

export default class Index extends React.Component {
  // imgLoading解决imgSwipper造成的bug
  // 初始状态时表示图片还没加载完成，当请求数据
  state = {
    imgSwipper: [],
    imgHeight: 176,
    imgLoading: false,
    group: [],
    news: [],
    cityName: "上海"
  };

  // 页面一进来，挂载，发送请求
  componentDidMount = () => {
    this.getSwippers();
    this.getGroup();
    this.getAbvisory();

    // 使用H5中的地理位置API，来获取当前用户所在的地理位置
    // navigator.geolocation.getCurrentPosition(position => {
    //   // console.log("当前位置的信息：", position);
    // });

    const myCity = new BMap.LocalCity();
    myCity.get(async result => {
      // 通过Ip定位，拿到当前城市信息
      const cityName = result.name;
      // console.log(cityName);

      // 调用接口换取项目中有房源的城市信息
      const res = await axios.get("http://localhost:8080/area/info", {
        // params是用于添加到url请求中字符串后面的，用于get请求;name=xxx；其中name就是紧接在info后的name；而cityname就是xxx，也是value
        params: {
          name: cityName
        }
      });
      // 根据接口返回的定位结果
      // console.log("接口返回的城市信息：", res);

      const { label, value } = res.data.body;

      this.setState({
        cityName: label
      });
      // 1.在一个页面中做的定位，在另一个页面中作为数据进行使用，则该数据要存储在localStorage，保证在另一个页面中能拿到该数据
      // 2.同样的在一个页面定位后，即使刷新也仍保持该数据在本页面，同样也是要保存在localStorage

      // 将获取到的当前城市，存储到本地缓存中
      // 要存储的是json对象，但本地缓存中只能存字符串，要先将对象转为字符串JSON.stringify，才能存储
      localStorage.setItem("hkz_city", JSON.stringify({ label, value }));
    });
  };

  // 轮播图数据
  async getSwippers() {
    // await axios({
    //   method: "get",
    //   url: "http://localhost:8080/home/swiper"
    // }).then(res => {
    //   // console.log(res);
    //   this.setState({
    //     imgSwipper: res.data.body
    //   });
    // });
    const res = await axios({
      method: "get",
      url: "http://localhost:8080/home/swiper"
    });
    // console.log(res);
    this.setState({
      imgSwipper: res.data.body,
      imgLoading: true
    });
  }
  // 租房小组数据
  async getGroup() {
    const res = await axios.get(
      "http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0"
    );
    // console.log(res);
    this.setState({
      group: res.data.body
    });
  }
  // 最新资讯数据
  async getAbvisory() {
    const res = await axios.get(
      "http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0"
    );
    // console.log(res);
    this.setState({
      news: res.data.body
    });
  }

  // 拿到数据后渲染轮播图的数据到页面上
  // 必须要有返回值
  renderSwipper() {
    return this.state.imgSwipper.map(item => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{
          display: "inline-block",
          width: "100%",
          height: this.state.imgHeight
        }}
      >
        {/* onLoad 图片加载完成事件 */}
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
            this.setState({ imgHeight: "auto" });
          }}
        />
      </a>
    ));
  }

  // 合租信息导航
  renderHouseInfo() {
    return houseInfo.map(item => (
      <Flex.Item key={item.title}>
        <Link to={item.url}>
          <img src={item.src} alt="" />
          <p>{item.title}</p>
        </Link>
      </Flex.Item>
    ));
  }

  // 最新资讯
  renderAbvisory() {
    return this.state.news.map(item => (
      <div key={item.id}>
        <Flex justify="between" className="newsList">
          <div className="left">
            <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
          </div>
          <div className="content">
            <div className="title">{item.title}</div>
            <Flex justify="between" className="timer">
              <div className="website">{item.from}</div>
              <div className="time">{item.date}</div>
            </Flex>
          </div>
        </Flex>
      </div>
    ));
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swipper">
          {/* {!this.state.imgLoading ? null : (
          <Carousel autoplay={true} infinite>
            {this.renderSwipper()}
          </Carousel>
        )} */}
          {this.state.imgLoading && (
            <Carousel autoplay={true} infinite>
              {this.renderSwipper()}
            </Carousel>
          )}
        </div>

        {/* 搜索导航 */}
        <div className="search">
          <Flex justify="between">
            <div className="searchInpt">
              <Flex>
                <Link to="/citylist">
                  <div className="location">
                    <span>{this.state.cityName}</span>
                    <i className="iconfont icon-arrow" />
                  </div>
                </Link>
                <Link to="/search">
                  <div className="search-icon">
                    <i className="iconfont icon-seach" />
                    请输入小区或地址
                  </div>
                </Link>
              </Flex>
            </div>
            <Link to="/map">
              <div className="icon">
                <i className="iconfont icon-map" />
              </div>
            </Link>
          </Flex>
        </div>

        {/* 合租信息导航 */}
        <Flex className="nav">{this.renderHouseInfo()}</Flex>

        {/* 租房小组 */}
        <div className="rentHouseGroup">
          <h3>
            <Flex justify="between">
              <span>租房小组</span>
              <span>更多</span>
            </Flex>
          </h3>
          <div>
            <Grid
              data={this.state.group}
              columnNum={2}
              hasLine={false}
              square={false}
              activeStyle
              renderItem={item => (
                <Flex justify="between">
                  <div className="title">
                    <p>{item.title}</p>
                    <p>{item.desc}</p>
                  </div>
                  <div className="imgSrc">
                    <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                  </div>
                </Flex>
              )}
            />
          </div>
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3>最新资讯</h3>
          <WingBlank size="lg">{this.renderAbvisory()}</WingBlank>
        </div>
      </div>
    );
  }
}
