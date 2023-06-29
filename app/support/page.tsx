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
  /[思雨棋睿菲明元坤洪娴轩敏]$/,
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
  /.*Meng/,
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
        alert("六月的密码是：june");
        break;
      }
    }
    if (!valid) {
      alert("未发现匹配，请注意大小写。");
      updateDB({ valid, input: name, pattern: "" });
    }
  };

  return (
    <div className="container">
      <div className="text-container">
        <br />
        <p>欢迎大家使用我的网站!</p>
        <p>到月末了，请大家对6月的使用情况，和对自己的帮助大小自助付费。</p>
        <p>多用多付，少用少付，不用不付。 </p>
        {/* <p>
          比如目前网站新增了预制角色功能（面具），可以方便地创建、分享和调试你的个性化对话。
        </p>
        <p>在对话框中，输入“/”，也会弹出一些指令，让gpt扮演一些角色。</p>
        <p>
          但是由于服务器成本较高，我不得不对网站进行限制，只允许部分用户使用。现在网站仅对曾有过捐赠的朋友开放。
        </p>
        <p>
          通过微信捐赠的朋友，在下面输入你的微信昵称；通过支付宝捐赠的朋友，在下面输入你的真实姓名。后台会自动查询记录，匹配成功就会显示密码。
        </p>
        <p>
          微信的机制是显示微信*昵称*的第一个字和最后一个字，所以如果你的微信昵称是“嗷大喵”，那我这边显示的就是“嗷*喵”，所以网站后台会检验你的名字首尾是不是符合，符合就通过。
        </p>
        <p>
          支付宝的机制是显示*真实姓名*的最后一个字，所以如果你是“慕容云海”，那我这边显示的就是“*海”，我也以此进行匹配。
        </p>
        <p>
          微信昵称是一个橙子表情的朋友，输入你当时捐赠的数额即可。也可以直接和我联系。
        </p>
        <p>
          原本想开发个人账号功能，但是需要的时间有点超出了我的精力。所以目前计划是，在对用户进行初筛后，每个月进行一次自愿捐赠。
        </p> */}

        <label>
          Your name is:
          <input type="text" value={name} onChange={handleInputChange} />
        </label>
        <button onClick={handleButtonClick}>Check</button>
        <p>
          如果使用中有任何问题，可以通过邮件与我联系。我的邮箱是bigcatisgreat@gmail.com。
        </p>
      </div>
      {/* <div className="image-container">
        <p>微信二维码:：</p>
        <Image src="wechat.png" alt="wechat" className="image" />
      </div> */}
      <div className="hidden-text-container">
        {showText && <p>当前密码: july</p>}
      </div>
      <div className="image-container">
        <p>支付宝二维码：</p>
        <Image src="alipay.png" alt="alipay" className="image" />
      </div>
    </div>
  );
}
