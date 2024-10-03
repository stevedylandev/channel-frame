/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";
import { generateAuthToken } from "@/utils/authKey";

const app = new Frog({
	basePath: "/api",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
	return c.res({
		action: "/join",
		image:
			"https://dweb.mypinata.cloud/ipfs/QmWnDf7iM4H9EJJLnW7tjaHgkHVPCWwcPSaM8TCfvBDjtP?img-format=webp",
		intents: [<Button>Request to Join</Button>],
	});
});

app.frame("/join", async (c) => {
	const authToken = await generateAuthToken();

	console.log(authToken);

	const joinReq = await fetch("https://api.warpcast.com/fc/channel-invites", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			channelId: "pinata",
			inviteFid: c.frameData?.fid,
			role: "member",
		}),
	});
	const joinRes = await joinReq.json();
	console.log(joinRes);

	if (
		joinRes.errors &&
		joinRes.errors[0].message ===
			"User must follow channel or inviter to be invited as member"
	) {
		return c.res({
			action: "/join",
			image:
				"https://dweb.mypinata.cloud/ipfs/QmZfCdDqsMfm9KWH5kPmJsD27vgWTmdhMZFzGMmSaQK9YQ?img-format=webp",
			intents: [<Button>Try Again</Button>],
		});
	}

	if (joinRes.result && joinRes.result.success) {
		return c.res({
			image:
				"https://dweb.mypinata.cloud/ipfs/QmREw24yRCLAX7aESuPmhGyqNBqtx7cxxnGgFVYeoaD5A9?img-format=webp",
			intents: [
				<Button.Link href="https://github.com/stevedylandev/channel-frame">
					Source Code
				</Button.Link>,
			],
		});
	}

	return c.res({
		action: "/join",
		image:
			"https://dweb.mypinata.cloud/ipfs/QmVaSL2BBagzatjQ8RYJVLQ1ooVYtpt8dwJVqujBJBtLUT?img-format=webp",
		intents: [<Button>Try Again</Button>],
	});
});

export const GET = handle(app);
export const POST = handle(app);
