export default {
	async fetch(request, env, ctx) {
		if (request.method === 'POST') {
			try {
				const data = await request.json();

				if (!data?.prompt) return new Response('Missing "prompt" in request body', { status: 400 });

				const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
					prompt: data.prompt,
					max_tokens: 2048
				});

				if (!response?.response) {
					console.error('No response from AI model');
					return new Response('Error from AI model', { status: 500 });
				}

				return new Response(
					JSON.stringify({
						response: response.response,
					}),
					{
						headers: { 'Content-Type': 'application/json' },
					}
				);
			} catch (err) {
				console.error('Error:', err);
				return new Response(JSON.stringify({ error: err.message }), { 
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}

		return new Response('Send a POST request with JSON containing "prompt"', { status: 200 });
	},
};
