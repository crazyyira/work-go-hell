# 职场速效救心丸

辞职还是搬砖？上天自有公论

## 技术栈

- **Next.js 15** - React 框架
- **React 19** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Motion** - 动画库
- **Canvas Confetti** - 彩纸效果

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
work-go-hell/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ClockOutCountdown.tsx
│   ├── DivinationSection.tsx
│   ├── InputSection.tsx
│   ├── ResultSection.tsx
│   └── RetroButton.tsx
├── lib/                   # 工具函数和常量
│   ├── constants.ts
│   └── utils.ts
├── next.config.ts         # Next.js 配置
├── tailwind.config.ts     # Tailwind 配置
└── package.json
```

## 功能特性

- 📝 吐槽输入和历史记录
- 🔥 粉碎/焚烧烦恼动画
- 🎲 赛博掷杯茭占卜
- 🎉 结果展示和下载
- ⏰ 下班倒计时

## License

Apache-2.0
