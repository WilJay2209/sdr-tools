module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postContent, pillar } = req.body;

  if (!postContent || !pillar) {
    return res.status(400).json({ error: 'Missing postContent or pillar' });
  }

  const pillarNames = ['', 'Foundation', 'Input Control', 'Execution Standard', 'Operating Rhythm', 'Signal Management'];
  const pillarDescriptions = [
    '',
    'ICP Definition, Account Sourcing, Tech Stack, Rep Onboarding',
    'Filter 2 & 3 - Problem Likelihood & Role Accessibility',
    'Sequence, Qualification, CRM, Consistency',
    'Five-Day Diagnostic Cadence',
    'Re-Entry, Abandonment, Composition, MTG Rate'
  ];

  const prompt = `You are Wilberforce Moyo, an SDR Operations consultant with 18 years of B2B SaaS experience. You've built the SDR Operating System with 5 pillars: Reducing Variance. Increasing Predictability.

This Reddit post was just shared:
"${postContent}"

This post relates to Pillar ${pillar}: ${pillarNames[pillar]} (${pillarDescriptions[pillar]})

Generate a compelling, original LinkedIn post that:
1. Opens with "Here's what I'm seeing on Reddit..." (authentic voice)
2. Identifies the SPECIFIC problem from this Reddit post (not generic)
3. Explains how Pillar ${pillar} (${pillarNames[pillar]}) solves it
4. Includes a concrete example or statistic relevant to THIS problem
5. Contrarian angle: explains why most teams fail at this
6. Ends with: "DM me AUDIT if you want to [specific outcome related to this problem]."

Make it personal, data-driven, and based on what was actually said in the Reddit post. Not a template. Write in first person. Make it feel like you just read this post and have insights to share.

Output ONLY the LinkedIn post text. No markdown, no formatting. Just the post.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error });
    }

    const linkedinPost = data.content[0].text;
    return res.status(200).json({ linkedinPost });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate post' });
  }
};
