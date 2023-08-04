interface ImageEmbed {
	id: string;
	url: string;
	type: string;
	image: {
	  url: string;
	  proxyURL: string;
	  width: number;
	  height: number;
	};
	fields: any[];
}
  
interface GifvEmbed {
	id: string;
	url: string;
	type: string;
	referenceId: string;
	provider: {
	  name: string;
	  url: string;
	};
	thumbnail: {
	  url: string;
	  proxyURL: string;
	  width: number;
	  height: number;
	};
	video: {
	  url: string;
	  proxyURL: string;
	  width: number;
	  height: number;
	};
	fields: any[];
}
  
interface Attachment {
	width: number;
	url: string;
	size: number;
	proxy_url: string;
	id: string;
	height: number;
	filename: string;
	content_type: string;
	spoiler: boolean;
}

interface Gif {
	format: number;
	src: string;
	width: number;
	height: number;
	order: number;
}

interface Versions {
	clientVersion: number;
	serverVersion: number;
	dataVersion: number;
}

interface FavoriteGifs {
	gifs: Record<string, Gif>;
}

export interface FrecencyStore {
	versions: Versions;
	favoriteGifs: FavoriteGifs;
}  
  
export interface Message {
	embeds: (ImageEmbed | GifvEmbed)[];
	attachments: Attachment[];
}
  
export function getGifUrl(message: Message): string | null {
	for (let embed of message.embeds) {
	  if (embed.type === 'gifv') {
		return (embed as GifvEmbed).url;
	  } else if (embed.type === 'image' && embed.url.endsWith('.gif')) {
		return (embed as ImageEmbed).url;
	  }
	}
  
	for (let attachment of message.attachments) {
	  if (attachment.url.endsWith('.gif')) {
		return attachment.url;
	  }
	}
  
	return null;
}

export function filterOutFirstAndLast(favorites: FrecencyStore): FrecencyStore {
	const gifEntries = Object.entries(favorites.favoriteGifs.gifs);
  
	// Sort the gif entries by the order property
	gifEntries.sort((a, b) => a[1].order - b[1].order);
  
	// Remove the first and last entries
	if (gifEntries.length > 2) {
	  gifEntries.pop();
	  gifEntries.shift();
	}
  
	// Construct the new favoriteGifs object
	const newFavoriteGifs = gifEntries.reduce((gifs, [url, gif]) => {
	  gifs[url] = gif;
	  return gifs;
	}, {} as Record<string, Gif>);
  
	// Return the new favorites object
	return { ...favorites, favoriteGifs: { gifs: newFavoriteGifs } };
  }  