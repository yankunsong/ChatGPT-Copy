"use client";

import Image from "next/image";
import React, { useState } from "react";
import AWS from "aws-sdk";
import "./styles.scss";
interface InputProps {
  valid: boolean;
  input: string;
  pattern?: string;
  amount?: string;
}

const patterns = [
  /[思雨棋睿菲明元坤洪娴轩敏盐妍岩卓娟克琳]$/,
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
  const now = new Date().toISOString();
  const params = {
    TableName: "click_tracker",
    Item: {
      click_time: { S: now },
      valid: { BOOL: input.valid },
      input: { S: input.input },
      pattern: { S: input.pattern },
      amount: { S: input.amount },
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
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value);
  };

  const handleButtonClick = () => {
    if (showText) return;
    let valid = false;
    let isAdvancedTmp = isAdvanced;
    if (Number(amount) >= 30) isAdvancedTmp = true;
    setIsAdvanced(isAdvancedTmp);

    for (const pattern of patterns) {
      if (pattern.test(name)) {
        valid = true;
        updateDB({
          valid,
          input: name,
          pattern: pattern.toString(),
          amount: amount,
        });
        setShowText(true);
        console.log("isAdvanced", isAdvanced);
        const notice = "密码是：2024";
        alert(notice);
        break;
      }
    }
    if (!valid) {
      alert("未发现匹配，请注意大小写，或邮件与我联系");
      updateDB({ valid, input: name, pattern: "" });
    }
  };

  return (
    <div className="container">
      <div className="text-container">
        <p>大家好！</p>
        <p>
          最近我收到了官方的提醒，检测出我的账号有很多来自国内的流量，需要我进行处理。所以我暂时只能选择无限期关停这个网站。{" "}
        </p>
        <p>
          网站上线的一年多里，得到了很多星球朋友们的支持，很高兴能帮助到大家。很遗憾因为政策原因，网站不能继续保留。
        </p>
        <p>
          待我最近工作空闲一点后，我会研究一下有没有其他的办法。如果有的话，我会在星球里和大家更新。
        </p>
        {/* <label>
          Your name is:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <label>
          我刚刚已付费:
          <input type="text" value={amount} onChange={handleAmountChange} />
        </label>
        <button onClick={handleButtonClick}>Check</button> */}
        <p>
          如果大家有任何的想法和建议，可以通过邮件与我联系。我的邮箱是bigcatisgreat@gmail.com。
        </p>
      </div>
      {/* <div className="image-container">
        <p>微信二维码:：</p>
        <Image src="wechat.png" alt="wechat" className="image" />
      </div> */}
      <div className="hidden-text-container">
        {showText && isAdvanced && <p>密码: 2024</p>}
        {showText && !isAdvanced && <p>密码: 2024</p>}
      </div>
      <div className="image-container">
        <p>支付宝二维码：</p>
        <Image src="alipay.png" alt="alipay" className="image" />
      </div>
    </div>
  );
}
