// landyard check user false
// {
//     "error": {
//         "code": "user_not_monitored",
//         "message": "User is not being monitored by Lanyard"
//     },
//     "success": false
// }

// landyard check user true
// {
//     "data": {
//         "kv": {},
//         "spotify": null,
//         "discord_user": {
//             "id": "1136648929753178213",
//             "username": "miyagawamizu",
//             "avatar": "297e010adcdaeeb123266c3eb4754e40",
//             "discriminator": "0",
//             "bot": false,
//             "global_name": "Mizu🥬",
//             "display_name": "Mizu🥬",
//             "public_flags": 4194432,
//             "avatar_decoration_data": null
//         },
// "activities": [], // if user not do anything
// "activities": [
//             {
//                 "id": "custom",
//                 "name": "Custom Status",
//                 "type": 4,
//                 "state": "website: mizu.its.moe",
//                 "emoji": {
//                     "id": "1005020086916100097",
//                     "name": "DelaceyAra",
//                     "animated": false
//                 },
//                 "created_at": 1695385925264
//             },
//             {
//                 "flags": 1,
//                 "id": "20995b930b79a522",
//                 "name": "VS Code",
//                 "type": 0,
//                 "state": "📝 script.js:69:13",
//                 "session_id": "46e134b0c98f66e9477de048cbc1ca06",
//                 "details": "📂 miyagawamizu.github.io - 0 ⚠️",
//                 "timestamps": {
//                     "start": 1695387742684
//                 },
//                 "application_id": "1136142017743822969",
//                 "assets": {
//                     "large_image": "mp:external/ftBjuYHxeAs2FW1lMnr-_BxOSttEZIc1aAzg_W3nFlM/https/raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/js.png",
//                     "large_text": "Editing a JS file",
//                     "small_image": "mp:external/Joitre7BBxO-F2IaS7R300AaAcixAvPu3WD1YchRgdc/https/raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/vscode.png",
//                     "small_text": "Visual Studio Code"
//                 },
//                 "buttons": [
//                     "View Repository",
//                     "GitHub Profile"
//                 ],
//                 "created_at": 1695400647117
//             }
//         ],
//         "discord_status": "online",
//         "active_on_discord_web": false,
//         "active_on_discord_desktop": true,
//         "active_on_discord_mobile": false,
//         "listening_to_spotify": false
//     },
//     "success": true
// }

const userID = "1136648929753178213"; //put your discord user id here. like my ID: 738748102311280681
const statusImage = document.getElementById("status-image");
const avatarImage = document.getElementById("avatar-image");
const bannerImage = document.getElementById("banner-image");
const bannerColor = document.querySelector(".banner");
const display_name = document.querySelector(".display-name");
const username = document.querySelector(".username");
const badges = document.querySelector(".badges-left");

async function fetchDiscordStatus() {
	try {
		const response = await axios.get(
			`https://api.lanyard.rest/v1/users/${userID}`
		);

		const lookupResponse = await axios.get(
			`https://discordlookup.mesavirep.xyz/v1/user/${userID}`
		);
		const { data } = response.data;
		const { discord_status, activities, discord_user } = data;
		const {
			avatar,
			banner,
			badges: userBadges,
			global_name,
			tag,
		} = lookupResponse.data;

		display_name.innerHTML = discord_user.display_name; // Change the display name.
		username.innerHTML = discord_user.username; // Change the username.
		// display_name.innerHTML = global_name; // Change the display name.
		// username.innerHTML = tag; // Change the username.

		// Get the corresponding image path for the status.
		let imagePath;
		switch (discord_status) {
			case "online":
				imagePath = "/public/status/online.svg";
				break;
			case "idle":
				imagePath = "/public/status/idle.svg";
				break;
			case "dnd":
				imagePath = "/public/status/dnd.svg";
				break;
			case "offline":
				imagePath = "/public/status/offline.svg";
				break;
			default:
				imagePath = "/public/preload.png";
				break;
		}

		// Check the streaming activity of the user to update the image path.
		if (
			activities.find(
				(activity) =>
					activity.type === 1 &&
					(activity.url.includes("twitch.tv") ||
						activity.url.includes("youtube.com"))
			)
		) {
			imagePath = "/public/status/streaming.svg";
		}

		// check if "discord_status": "online" and "active_on_discord_mobile": true set src to /public/status/online-mobile.svg"
		if (discord_status === "online" && data.active_on_discord_mobile) {
			imagePath = "/public/status/online-mobile.svg";
		}

		// if banner is null, do nothing
		if (banner.id == null) {
			bannerImage.src =
				"https://i2.100024.xyz/2023/09/23/oz5vwn.webp";
		}
		// else set banner image
		else {
			bannerImage.src = `https://cdn.discordapp.com/banners/${discord_user.id}/${banner.id}?format=webp&size=1024`;
			bannerImage.alt = `Discord banner: ${discord_user.username}`;
		}

		// Update the image.
		statusImage.src = imagePath;
		statusImage.alt = `Discord status: ${discord_status}`;
		// avatarImage.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}?format=webp&size=1024`;
		bannerColor.style.backgroundColor = banner.color;
		avatarImage.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${avatar.id}?format=webp&size=1024`;
		avatarImage.alt = `Discord avatar: ${discord_user.username}`;

		// Clear existing badges
		badges.innerHTML = "";

		// Create and append badge images
		userBadges.forEach((badgeName) => {
			const badgeImg = document.createElement("img");
			const badgeSrc = badgeMappings[badgeName];
			if (badgeSrc) {
				badgeImg.src = badgeSrc;
				badges.appendChild(badgeImg);
			}
		});
	} catch (error) {
		console.error("Unable to retrieve Discord status:", error);
	}
}

// function staticBadges() {
// 	const rightBadges = document.querySelector(".badges-right");
// 	// Clear existing badges
// 	rightBadges.innerHTML = "";

// 	// Add static badges
// 	const staticBadges = ["NITRO", "LEGACY_USER"];
// 	staticBadges.forEach((badgeName) => {
// 		const badgeImg = document.createElement("img");
// 		const badgeSrc = badgeMappings[badgeName];
// 		if (badgeSrc) {
// 			badgeImg.src = badgeSrc;
// 			rightBadges.appendChild(badgeImg);
// 		}
// 	});
// }

// Mapping between badge names and SVG file paths
const badgeMappings = {
	HOUSE_BRILLIANCE: "/public/badges/hypesquad-brilliance.svg",
	ACTIVE_DEVELOPER: "/public/badges/active-developer.svg",
	HOUSE_BRAVERY: "/public/badges/hypesquad-bravery.svg",
	HOUSE_BALANCE: "/public/badges/hypesquad-balance.svg",
	EARLY_SUPPORTER: "/public/badges/early-supporter.svg",
	EARLY_VERIFIED_BOT_DEVELOPER:
		"/public/badges/early-verified-bot-developer.svg",
	PARTNERED_SERVER_OWNER: "public/badges/discord-partner.svg",
	LEGACY_USER: "/public/badges/legacy-username.svg",
	NITRO: "/public/badges/nitro.svg",
};

twemoji.parse(document.getElementById("flag"), {
	folder: "svg",
	ext: ".svg",
});

const tooltips = document.querySelectorAll(".tooltip");
tooltips.forEach((tooltip) => {
	tooltip.addEventListener("mouseenter", () => {
		const ariaLabel = tooltip.getAttribute("aria-label");
		tooltip.setAttribute("data-tooltip-content", ariaLabel);
	});

	tooltip.addEventListener("mouseleave", () => {
		tooltip.removeAttribute("data-tooltip-content");
	});
});

// Initial static badges
// staticBadges();
// Initial fetch
fetchDiscordStatus();
// Update status every 1 second
setInterval(fetchDiscordStatus, 6000);
