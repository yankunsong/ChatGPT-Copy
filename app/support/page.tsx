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
  const now = new Date().toISOString();
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
        alert("当前的密码是：july2");
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
        <p>抱歉强制大家回到这个页面。不过这是为了宣布一个好消息。 ：） </p>
        <p>
          OpenAI现在对所有用户开放了GPT-4的接口，也就是说，现在所有人都可以使用GPT-4的能力了。
        </p>
        <p>
          为了让大家体验，我决定本周尝试性地在设置里开放切换到GPT4模型的功能。{" "}
        </p>
        <p>如果你想尝试，请在设置里切换到GPT-4模型。 </p>
        <p>
          之所以说“尝试性”，是因为GPT4的价格是我们一直默认使用的GPT3.5的20倍。所以预期会有非常明显的支出。
        </p>
        <p>
          非常欢迎大家给我反馈，帮助我决定后面是不是要开放4的接口。以及如果开放的话，如何保持网站的收支平衡。{" "}
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
        {showText && <p>当前密码: july2</p>}
      </div>
      <div className="image-container">
        <p>支付宝二维码：</p>
        <Image src="alipay.png" alt="alipay" className="image" />
      </div>
    </div>
  );
}
