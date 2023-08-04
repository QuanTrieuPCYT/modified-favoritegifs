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
  