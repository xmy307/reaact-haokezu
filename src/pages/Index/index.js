import React from "react";

// 导入走马灯组件
import { Carousel, Flex } from "antd-mobile";
// 导入scss
import "./index.scss";

// 导入axios
import axios from "axios";

const PlaceHolder = ({ className = "", ...restProps }) => (
  <div className={`${className} placeholder`} {...restProps}>
    Block
  </div>
);

export default class Index extends React.Component {
  // imgLoading解决imgSwipper造成的bug
  // 初始状态时表示图片还没加载完成，当请求数据
  state = {
    imgSwipper: [],
    imgHeight: 176,
    imgLoading: false
  };

  // 页面一进来，挂载，发送请求
  componentDidMount = () => {
    this.getSwippers();
  };

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

  // 拿到数据后渲染轮播图的数据到页面上
  // 必须要有返回值
  renderSwipper() {
    return this.state.imgSwipper.map(item => (
      <a
        key={item}
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

  render() {
    return (
      <div>
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

        <div className="flex-container">
          <Flex>
            <Flex.Item>
              <PlaceHolder />
            </Flex.Item>
            <Flex.Item>
              <PlaceHolder />
            </Flex.Item>
            <Flex.Item>
              <PlaceHolder />
            </Flex.Item>
            <Flex.Item>
              <PlaceHolder />
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
  }
}
