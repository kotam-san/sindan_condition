const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const AXIS_NAMES = {
  A: "自分らしさの迷い度",
  B: "溜め込みの度合い",
  C: "本音の話しやすさ度（高いほど話せていない）",
  D: "エネルギーの残量（高いほど消耗している）",
};

const STAGE_NAMES = {
  1: "ひとやすみ",
  2: "静かな消耗",
  3: "要・立ち止まる",
};

// Claude API が失敗したときの静的フォールバック
const FALLBACK = {
  A: [
    "「比べる」をやめるのではなく、「違う」と見る。先代や他の経営者との差は、あなたが別の人間だというだけです。",
    "あなたが自然体でいられた瞬間を3つ思い出して、紙に書き出してみてください。そこにあなた自身の強みがあります。",
    "「こうあるべき経営者像」を、他の誰かの言葉ではなく、自分の言葉で定義し直す時間を取ってみましょう。",
  ],
  B: [
    "「飲み込む」前に、まず紙に書いて吐き出す。誰かに見せなくていい。書くだけで少し軽くなります。",
    "「大人の対応」をした日は、意識的に回復の時間を作る。飲み込んだ分だけ、自分に何かを補充する習慣を。",
    "週に一度、小さな本音を誰かに話す場を持つ。「実はさ…」と言える相手を一人探すことから始めてみましょう。",
  ],
  C: [
    "「弱みを見せること」と「信頼を失うこと」は別物です。本音を話せる場が、経営者の孤独を和らげる最初の一手になります。",
    "社外の経営者と月に1回でも会う機会を作ってみてください。立場が近いだけで、話せることが変わります。",
    "まず一人だけ、何でも話せる人を探すことから始める。コーチでも、同業仲間でも、家族以外の誰かでも。",
  ],
  D: [
    "「やらないこと」を一つ決めて、エネルギーを守る。足し算より引き算が、今の自分には効きます。",
    "経営者としてではなく、一人の人間として過ごす時間を意識的に作ってみてください。",
    "将来への不安より、今日一日の小さな手応えに意識を向ける練習をしてみましょう。",
  ],
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS });
    }

    try {
      const { email, stage, topAxis, axisScores, total, freeText } = await request.json();

      // ── 1. Claude API で個別提案を生成 ──
      const freeTextLine = freeText
        ? `\n今、一番気になっていること：「${freeText}」\n`
        : "";

      const prompt = `あなたは後継者・若手経営者を専門とするエグゼクティブコーチです。
以下のコンディション診断の結果をもとに、今この方に最も届く3つの具体的な提案を書いてください。

【診断スコア（各20点満点）】
・${AXIS_NAMES.A}：${axisScores.A}点
・${AXIS_NAMES.B}：${axisScores.B}点
・${AXIS_NAMES.C}：${axisScores.C}点
・${AXIS_NAMES.D}：${axisScores.D}点
・総合スコア：${total}点（80点満点）
・最も高い軸：${AXIS_NAMES[topAxis]}
・ステージ：${stage}「${STAGE_NAMES[stage]}」
${freeTextLine}
【出力ルール】
- 提案を3つ書く
- 各提案は1〜2文（具体的な行動や視点の転換）
- 3つの間は「|||」で区切る。それ以外のテキストは一切含めない
- 口調は「です・ます」で温かく
- 上から目線にならず、同じ目線で語りかける
- 経営者の孤独や疲弊に共感したうえで、次の一歩を示す`;

      let suggestions = [];

      if (env.ANTHROPIC_API_KEY) {
        const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 800,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (claudeRes.ok) {
          const claudeData = await claudeRes.json();
          const text = claudeData.content[0].text;
          suggestions = text.split("|||").map((s) => s.trim()).filter(Boolean).slice(0, 3);
        }
      }

      // フォールバック（API未設定またはエラー時）
      if (suggestions.length < 3) {
        suggestions = FALLBACK[topAxis] || FALLBACK.D;
      }

      // ── 2. メール配信サービスへの登録（MailerLite等・未設定なら省略） ──
      // if (env.MAILER_API_KEY && email) {
      //   await registerEmail(email, stage, env.MAILER_API_KEY);
      // }

      return new Response(JSON.stringify({ success: true, suggestions }), {
        headers: { "Content-Type": "application/json", ...CORS },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }
  },
};
