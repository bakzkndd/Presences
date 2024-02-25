const presence = new Presence({
		clientId: "1161309082179883089",
	}),
	onBrowsingTimeStamp = Math.floor(Date.now() / 1000);

let currentTime: number,
	duration: number,
	paused: boolean,
	played: boolean,
	timestamps;

const searchTxt: HTMLInputElement = document.querySelector("#s"),
	paginationTxt: HTMLElement = document.querySelector(
		"#contenedor > div.module > div.content > div.pagination > span:nth-child(1)"
	),
	animenameTxt: HTMLElement = document.querySelector(
		"#single > div.content > div.sheader > div.data > h1"
	),
	airdate: HTMLElement = document.querySelector(
		"#single > div.content > div.sheader > div.data > div.extra > span.date"
	),
	episodenameTxt: HTMLElement = document.querySelector("#info > h1");

interface IFrameMetaData {
	currentTime: number;
	duration: number;
	paused: boolean;
	played: boolean;
}

presence.on("iFrameData", (data: IFrameMetaData) => {
	({ currentTime, duration, paused, played } = data);
});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey:
				"https://cdn.rcd.gg/PreMiD/websites/G/GoAnimes/assets/logo.png",
			startTimestamp: onBrowsingTimeStamp,
		},
		{ pathname } = document.location;

	if (pathname === "/") {
		if (document.title.includes("Você pesquisou por ")) {
			presenceData.details = "Pesquisando por: ";
			presenceData.state = searchTxt.value;
		} else presenceData.details = "Explorando a homepage";
	} else if (pathname.includes("series") || pathname.includes("filme")) {
		if (
			pathname.split("/").length - 1 === 2 ||
			pathname.split("/").length - 1 === 4
		) {
			presenceData.details = "Explorando o catálogo";
			presenceData.state = paginationTxt.textContent;
		} else {
			presenceData.details = pathname.includes("filme")
				? "Assistindo um filme"
				: animenameTxt.textContent;
			presenceData.state = pathname.includes("filme")
				? animenameTxt.textContent
				: airdate.textContent;
		}
	} else if (pathname.includes("episodio")) {
		presenceData.details = episodenameTxt.textContent;
		if (played) {
			if (!paused) {
				timestamps = presence.getTimestamps(
					Math.floor(currentTime),
					Math.floor(duration)
				);
				[presenceData.startTimestamp, presenceData.endTimestamp] = timestamps;
				presenceData.smallImageKey = Assets.Play;
				presenceData.smallImageText = "Asssitindo";
			} else {
				presenceData.smallImageKey = Assets.Pause;
				presenceData.smallImageText = "Pausado";
			}
		}
	} else if (pathname.includes("calendario"))
		presenceData.details = "Vendo o calendario de lançamentos";

	presence.setActivity(presenceData);
});
