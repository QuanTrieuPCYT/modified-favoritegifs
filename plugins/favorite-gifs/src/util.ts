export interface ImageEmbed {
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
  
export interface GifvEmbed {
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
  
export interface Message {
	embeds: (ImageEmbed | GifvEmbed)[];
}

export function getGifUrl(message: Message): string | null {
	for (let embed of message.embeds) {
	  if (embed.type === 'gifv') {
		return (embed as GifvEmbed).url;
	  }
	  else if (embed.type === 'image' && embed.url.endsWith('.gif')) {
		return (embed as ImageEmbed).url;
	  }
	}
  
	return null;
}