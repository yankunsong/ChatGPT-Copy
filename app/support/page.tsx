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
  /[思雨棋睿菲明元坤洪娴轩敏盐妍岩卓]$/,
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
        const notice = "密码是：oct";
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
        <br />
        {/* <p>欢迎大家使用我的网站!</p>
        <p>到月末了，请大家对6月的使用情况，和对自己的帮助大小自助付费。</p>
        <p>多用多付，少用少付，不用不付。 </p> */}
        <p>
          <strong>请大家对8月和9月至今的使用情况自行付费。</strong>
        </p>
        <p>
          8月试着开放了GPT4接口，收费30元。但是官方价格过高，这个收费仅够支付10天不到的费用。如果要维持平衡，得收费100多元一月。
        </p>
        <p>所以目前网站将只开放GPT3.5。</p>
        <p>感谢有一些朋友在8月底9月初自行回到了这个页面进行了支持。</p>
        <p>
          <strong>
            有两位朋友8月底支付了GPT4的价格，请务必与我联系，我将给你们退款。
          </strong>
        </p>
        <br />
        <p>关于付费：</p>
        <p>
          本网站初衷是方便董董星球的朋友体验GPT，无盈利目的。放收款码是因为GPT的访问不是免费的，通过API对话会产生一定的费用。
        </p>
        <p>
          目前只有初期主动捐赠过的用户才在白名单里。所以如果你是刚知道这个网站并且想使用，请邮件与我说明情况。
        </p>
        <label>
          Your name is:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <label>
          我刚刚已付费:
          <input type="text" value={amount} onChange={handleAmountChange} />
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
        {showText && isAdvanced && <p>密码: oct</p>}
        {showText && !isAdvanced && <p>密码: oct</p>}
      </div>
      <div className="image-container">
        <p>支付宝二维码：</p>
        <Image src="alipay.png" alt="alipay" className="image" />
      </div>
    </div>
  );
}
