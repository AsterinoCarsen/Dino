import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    const response = await fetch(
        'https://api-inference.huggingface.co/models/mistralai/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'mistralai/Mistral-7B-Instruct-v0.3',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
            }),
        }
    );

    console.log(response);

    const data = await response.json();
    console.log(data);
    return res.status(200).json({ text: data.choices[0].message.content });
}