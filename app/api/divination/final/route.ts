export async function POST(request: Request) {
  try {
    const { complaint, divinationResults } = await request.json();

    if (!divinationResults || divinationResults.length !== 3) {
      return Response.json(
        { error: '需要三次掷茭结果' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TUZIAI_API_KEY;
    if (!apiKey) {
      return Response.json(generateFallbackFinalResult(divinationResults));
    }

    // 构建 system prompt
    const systemPrompt = `你是一位幽默风趣的赛博占卜师，专门为打工人解答"是否该辞职"的困惑。

你的风格特点：
- 说话接地气，充满网络梗和打工人黑话
- 既搞笑又一针见血，让人笑中带泪
- 根据掷茭结果给出不同风格的解读：
  * 圣杯（大吉）：爽快直接，鼓励辞职，但要提醒"不辞职就做善事"
  * 阴杯（下吉）：小扎心但不失幽默，劝人冷静
  * 笑杯（中吉）：调侃犹豫，建议摸鱼

掷茭规则：
- 一正一反 = 圣杯（肯定）
- 两面皆反 = 笑杯（犹豫）  
- 两面皆正 = 阴杯（否定）

最终判断：
- 两次圣杯 = 吉（建议辞职）
- 两次阴杯 = 凶（建议留下）
- 三次结果都一样 = 暂缓决定（建议摸鱼）
- 其他情况 = 看情况（建议摸鱼）

你需要返回 JSON 格式：
{
  "cardTitle": "卡片标题（8-12字，要有创意和幽默感）",
  "cardSubtitle": "副标题（10-15字，要搞笑）",
  "stamp": "印章文字（2-4字）",
  "interpretation": "解读文字（30-50字，要搞笑、扎心或爽快）",
  "divinationText": "掷茭总结（20-30字）",
  "finalResult": "QUIT" | "STAY" | "MAYBE"
}`;

    // 构建用户 prompt
    const resultsText = divinationResults
      .map((r: string, i: number) => {
        const text = r === 'SHENG' ? '圣杯' : r === 'YIN' ? '阴杯' : '笑杯';
        return `第${i + 1}次：${text}`;
      })
      .join('\n');

    const userPrompt = `打工人的吐槽：${complaint || '无声的抗议'}

三次掷茭结果：
${resultsText}

请根据以上信息，生成最终的占卜结果卡片。记住要幽默搞笑，让打工人看了会心一笑！`;

    // 调用 API（10秒超时）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
      const result = JSON.parse(content);

      console.log('AI Final Result:', result);

      return Response.json(result);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('Fetch Error:', fetchError.message);
      return Response.json(generateFallbackFinalResult(divinationResults));
    }
  } catch (error) {
    console.error('Final result API Error:', error);
    return Response.json({
      cardTitle: "赛博占卜结果",
      cardSubtitle: "天意难测，且行且珍惜",
      stamp: "天意",
      interpretation: "网络不稳定，但神仙的意思你应该懂的。",
      divinationText: "技术故障，建议重试或自行决断。",
      finalResult: "MAYBE"
    });
  }
}

function generateFallbackFinalResult(results: string[]) {
  const shengCount = results.filter(r => r === 'SHENG').length;
  const yinCount = results.filter(r => r === 'YIN').length;

  let finalResult: 'QUIT' | 'STAY' | 'MAYBE' = 'MAYBE';
  let cardTitle = '';
  let cardSubtitle = '';
  let stamp = '';
  let interpretation = '';
  let divinationText = '';

  if (shengCount >= 2) {
    finalResult = 'QUIT';
    cardTitle = '辞职申请书';
    cardSubtitle = '老子不干了！';
    stamp = '准予离职';
    interpretation = '两次圣杯！神仙都在催你快跑，不辞职就做善事吧！';
    divinationText = '圣杯加持，天意如此，是时候追求自由了。';
  } else if (yinCount >= 2) {
    finalResult = 'STAY';
    cardTitle = '再忍五天暴击卡';
    cardSubtitle = '为了五斗米折腰';
    stamp = '继续搬砖';
    interpretation = '两次阴杯，神仙劝你冷静。工资卡余额提醒你：梦想很贵。';
    divinationText = '阴杯示警，留得青山在，不怕没柴烧。';
  } else {
    finalResult = 'MAYBE';
    cardTitle = '赛博摸鱼许可证';
    cardSubtitle = '精神离职，肉体打卡';
    stamp = '暂缓决定';
    interpretation = '结果混乱，说明时机未到。建议继续观望，顺便摸摸鱼。';
    divinationText = '天意未明，不如静观其变，该来的总会来。';
  }

  return {
    cardTitle,
    cardSubtitle,
    stamp,
    interpretation,
    divinationText,
    finalResult
  };
}

