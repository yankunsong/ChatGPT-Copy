"use client";

import Image from "next/image";
import React, { useState } from "react";
import AWS from "aws-sdk";
import "./styles.scss";

const dynamodb = new AWS.DynamoDB({
  region: "us-east-1",
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
});

const updateDB = async () => {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const params = {
    TableName: "paid_user_click",
    Item: {
      click_time: { S: now },
    },
  };

  try {
    const data = await dynamodb.putItem(params).promise();
    console.log("New click counted");
  } catch (error) {
    console.error("Error adding new click item:", error);
  }
};

export default function App() {
  const [showText, setShowText] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const handleButtonClick = () => {
    if (showText || !hasPaid) return;
    setShowText(true);
    updateDB();
  };

  return (
    <div className="container">
      <div className="text-container">
        <br />
        <p>欢迎大家使用我的网站!</p>
        <p>
          网站上线以来，得到了很多朋友的支持，也帮助了很多朋友。我很开心能够帮助到大家。
        </p>
        <p>有很多朋友甚至捐赠了几十上百元，非常感谢你们的支持！</p>
        <p>感谢已经进行了付费的朋友，网站的持续运营得益于你们的支持！ </p>
        <p>
          近期我会采取这种自助形式，大概每周会更新一次密码，强制大家回到这个页面。最新的密码会在页面底端。
        </p>
        <p>
          后面应该会开发个人账号功能，每个人需要充值，每次对话会消耗对应的额度。
        </p>
        <p>
          另外，这个网站仅为星球朋友内部学习交流使用，请尽量不要分享给其他人。
        </p>
        <p>
          如果使用中有任何问题，可以通过邮件与我联系。我的邮箱是bigcatisgreat@gmail.com，有捐赠的朋友也可以加我微信，交个朋友。
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
        {showText && <p>当前密码: 1234</p>}
        <button onClick={handleButtonClick}>查看访问密码</button>
      </div>
    </div>
  );
}
