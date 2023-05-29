"use client";

import Image from "next/image";
import React, { useState } from "react";
import AWS from "aws-sdk";
import "./styles.scss";
interface InputProps {
  valid: boolean;
  input: string;
  pattern?: string;
}

const patterns = [
  /[思雨棋睿菲]$/,
  /.*S$/,
  /.*雨$/,
  /.*菜$/,
  /.*限$/,
  /^C.*N$/,
  /^z.*z$/,
  /.*佑$/,
  /^S.*a$/,
  /55/,
  /^w.*g$/,
  /.*诗$/,
  /^S.*y$/,
  /^S.*t$/,
  /^J.*n$/,
  /.*子$/,
  /^z.*z$/,
  /.*\)/,
  /.*茶$/,
  /.*郎$/,
  /^T.*e$/,
  /^A.*L$/,
  /^T.*i$/,
  /^E.*a$/,
  /^E.*e$/,
  /^惠.*o$/,
  /^Z.*y$/,
  /^A.*l$/,
  /^A.*I$/,
  /^莫.*.$/,
];

const dynamodb = new AWS.DynamoDB({
  region: "us-east-1",
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
});

const updateDB = async (input: InputProps) => {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const params = {
    TableName: "click_tracker",
    Item: {
      click_time: { S: now },
      valid: { BOOL: input.valid },
      input: { S: input.input },
      pattern: { S: input.pattern },
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
  const [name, setName] = useState("");

  const handleInputChange = (event: any) => {
    setName(event.target.value);
  };

  const handleButtonClick = () => {
    if (showText) return;
    let valid = false;
    for (const pattern of patterns) {
      if (pattern.test(name)) {
        valid = true;
        updateDB({ valid, input: name, pattern: pattern.toString() });
        setShowText(true);
        break;
      }
    }
    if (!valid) {
      updateDB({ valid, input: name, pattern: "" });
    }
  };

  return (
    <div className="container">
      <div className="text-container">
        <br />
        <p>欢迎大家使用我的网站!</p>
        <p>网站上线以来，得到了很多朋友的支持。我很开心能够帮助到大家。</p>

        <p>也正是你们的正反馈，让这个网站可以持续运营，并加以更新。 </p>
        <p>
          比如目前网站新增了预制角色功能（面具），可以方便地创建、分享和调试你的个性化对话。
        </p>
        <p>在对话框中，输入“/”，也会弹出一些指令，让gpt扮演一些角色。</p>
        <p>
          但是由于服务器成本较高，我不得不对网站进行限制，只允许部分用户使用。现在网站仅对这一个多月来有过捐赠的朋友开放。
        </p>
        <p>
          通过微信捐赠的朋友，在下面输入你的微信昵称；通过支付宝捐赠的朋友，在下面输入你的姓名。后台会自动查询记录，匹配成功就会显示密码。
        </p>
        <p>
          微信昵称是一个橙子的朋友，输入你当时捐赠的数额即可。也可以直接和我联系。
        </p>
        <p>
          原本想开发个人账号功能，但是需要的时间有点超出了我的精力。所以目前计划是，在对用户进行初筛后，每个月进行一次自愿捐赠。
        </p>

        <label>
          Your name is:
          <input type="text" value={name} onChange={handleInputChange} />
        </label>
        <button onClick={handleButtonClick}>Check</button>
        <p>
          如果使用中有任何问题，可以通过邮件与我联系。我的邮箱是bigcatisgreat@gmail.com，有捐赠的朋友也可以加我微信，交个朋友。
        </p>
      </div>
      {/* <div className="image-container">
        <p>微信二维码：</p>
        <Image src="wechat.png" alt="wechat" className="image" />
      </div> */}
      <div className="hidden-text-container">
        {showText && <p>当前密码: gpt</p>}
      </div>
      {/* <div className="image-container">
        <p>支付宝二维码：</p>
        <Image src="alipay.png" alt="alipay" className="image" />
      </div> */}
    </div>
  );
}
