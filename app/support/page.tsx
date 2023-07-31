"use client";

import Image from "next/image";
import React, { useState } from "react";
import AWS from "aws-sdk";
import "./styles.scss";
interface InputProps {
  valid: boolean;
  input: string;
  pattern?: string;
  advanced?: boolean;
}

const patterns = [
  /[思雨棋睿菲明元坤洪娴轩敏盐妍岩]$/,
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
  const [isAdvanced, setAdv] = useState(false);
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
    const amt = Number(amount) || 1;
    console.log(amt);
    if (amt >= 30) {
      setAdv(true);
      console.log("advanced mode on");
    }

    for (const pattern of patterns) {
      if (pattern.test(name)) {
        valid = true;
        updateDB({
          valid,
          input: name,
          pattern: pattern.toString(),
          advanced: isAdvanced,
        });
        setShowText(true);
        console.log("isAdvanced", isAdvanced);
        const notice = isAdvanced ? "高级密码是：aug44" : "普通密码是：aug";
        console.log(notice);
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
        <p>上个月网站开放了GPT4的接口，也随之产生了大量的费用。</p>
        <p>
          为了兼顾大家的普通需求，和对GPT4的需求，我决定暂时同时采用两种模式。
        </p>
        <p>
          1.
          普通模式：对所有有过付费的用户开放，并且先用后付。每个月底，自愿对这个月的使用情况付费。多用多付，少用少付，不用不付。
        </p>
        <p>比如这次付费，就是对7月的使用情况付费。</p>
        <p>
          2.
          高级模式：每次付费30元及以上，即可获得有GPT4权限的密码。该密码有效期为一个月。仅供自己使用，不得分享。
        </p>
        <p>
          下面的表单会自动判别数额，大于30即显示高级模式的密码。请如实填写。如有造假，永久拉黑。
        </p>
        <p>
          为了方便我核对，请大家付款的数额带上随意的小数点，如支付30.17，
          40.46等。
        </p>
        <p>
          模型可以在网页左下角的设置中选择，gpt-4或者gpt-3.5-turbo。gpt4仅在使用的是有权限的密码时生效。
        </p>
        <p>
          判断自己用的是哪个模型，可以问GPT，“我为什么没有参加我爸爸妈妈的婚礼？”GPT4会说“因为您的父母在您出生之前就已经结婚了”，而3.5则意识不到这一点。
        </p>
        <br />
        <p>关于付费：</p>
        <p>
          本网站初衷是方便董董星球的朋友体验GPT，无盈利目的。放收款码是因为GPT的访问不是免费的，通过API对话会产生一定的费用。
        </p>
        <p>官方GPT4的单价是GPT3.5的20倍。</p>
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
        {showText && isAdvanced && <p>高级密码: aug44</p>}
        {showText && !isAdvanced && <p>普通密码: aug</p>}
      </div>
      <div className="image-container">
        <p>支付宝二维码：</p>
        <Image src="alipay.png" alt="alipay" className="image" />
      </div>
    </div>
  );
}
