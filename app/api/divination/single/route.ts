export async function POST(request: Request) {
  try {
    const { result, index, complaint } = await request.json();

    const apiKey = process.env.TUZIAI_API_KEY;
    if (!apiKey) {
      // 降级：返回随机文案
      return Response.json({ text: getFallbackText(result) });
    }

    // 构建 system prompt
    const systemPrompt = `你是一位幽默风趣的赛博占卜师，专门为打工人解答"是否该辞职"的困惑。

掷茭规则：
- 一正一反 = 圣杯（肯定）
- 两面皆反 = 笑杯（犹豫）  
- 两面皆正 = 阴杯（否定）

你的风格特点：
- 说话接地气，充满网络梗和打工人黑话
- 既搞笑又一针见血，让人笑中带泪
- 根据掷茭结果给出不同风格的解读：
  * 圣杯（大吉）：爽快直接，鼓励辞职
  * 阴杯（下吉）：小扎心但不失幽默，劝人冷静
  * 笑杯（中吉）：调侃犹豫，建议摸鱼

请为这次掷茭生成一句搞笑的解读（15-25字）。

返回 JSON 格式：
{
  "text": "这次掷茭的搞笑解读"
}`;

    const resultName = result === 'SHENG' ? '圣杯' : result === 'YIN' ? '阴杯' : '笑杯';
    const userPrompt = `打工人的吐槽：${complaint}

这是第 ${index + 1} 次掷茭，结果是：${resultName}

请生成一句搞笑的解读。`;

    // 调用 API（5秒超时）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('https://api.tu-zi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.9,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const aiResult = JSON.parse(content);

      return Response.json({ text: aiResult.text });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('Fetch Error:', fetchError.message);
      return Response.json({ text: getFallbackText(result) });
    }
  } catch (error) {
    console.error('Single throw API Error:', error);
    return Response.json({ text: '神灵显化中，请稍候...' });
  }
}

function getFallbackText(result: string): string {
  const throwTexts = {
    SHENG: [
      '神仙点头了，这是要飞升的节奏！',
      '圣杯出现，老板听了会沉默，HR听了会流泪。',
      '一正一反，天意让你反了这个班！',
      '圣杯加持，辞职信已经在路上了。'
    ],
    YIN: [
      '两面朝天，神仙说：醒醒，房贷还没还完呢。',
      '阴杯警告，钱包提醒你要现实一点。',
      '神仙翻了个白眼：就你这存款还想辞职？',
      '阴杯示警，建议先攒够三年生活费再说。'
    ],
    XIAO: [
      '神仙笑了，可能在笑你还没穷够。',
      '笑杯出现，连神仙都觉得你在纠结什么。',
      '两面朝地，神仙说：要不先摸鱼试试？',
      '笑杯调侃，人生何必太认真，先摸鱼再说。'
    ]
  };
  const texts = throwTexts[result as keyof typeof throwTexts] || throwTexts.XIAO;
  return texts[Math.floor(Math.random() * texts.length)];
}

