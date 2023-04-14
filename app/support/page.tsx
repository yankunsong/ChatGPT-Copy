"use client";

import Image from "next/image";
import React, { useState } from "react";
import "./styles.scss";

export default function App() {
  const [showText, setShowText] = useState(false);
  const handleButtonClick = () => {
    setShowText(!showText);
  };
  const A = 66;
  const B = 30 * 7;
  return (
    <div className="container">
      <div className="text-container">
        <br />
        <p>欢迎大家使用我的网站!</p>
        <p>
          目前为止，网站的建立和运营已经产生了200多元的费用，并且每天还会新增十几元的消费。
        </p>
        <p>
          为了能长久地运行，现在开始网站将开始收费。大家可以根据自己的使用量，和GPT对自己的帮助程度，进行自助付费。
        </p>
        <p>
          我大概每周会更新一次密码，强制大家回到这个页面。最新的密码会在页面底端。
        </p>
        <p>
          另外，这个网站仅为星球朋友内部学习交流使用，请尽量不要分享给其他人。
        </p>
        <p>
          如果使用中有任何问题，可以通过邮件与我联系。我的邮箱是bigcatisgreat@gmail.com.
        </p>
      </div>
      <div className="progress-container">
        <text>
          目前进度: {A}/{B}
        </text>
        <progress id="my-progress-bar" value={A} max={B}></progress>
      </div>
      <div className="image-container">
        <Image src="wechat.jpg" alt="123" className="image" />
      </div>
      <div className="hidden-text-container">
        {showText && <p>当前密码: dong1</p>}
        <button onClick={handleButtonClick}>查看访问密码</button>
      </div>
    </div>
  );
}
