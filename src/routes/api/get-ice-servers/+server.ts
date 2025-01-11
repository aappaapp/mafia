import twilio from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '$env/static/private';
export async function GET({}) {
	const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
	const token = await client.tokens.create();
	console.log(token);
	return new Response(JSON.stringify(token.iceServers), {
		headers: { 'Content-Type': 'application/json' }
	});
}
