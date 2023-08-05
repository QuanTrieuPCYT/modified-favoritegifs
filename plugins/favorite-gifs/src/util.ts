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
	url: string;
	width: number;
	height: number;
	order: number;
}

interface GifDetails { 
	src: string,
	url: string,
	width: number,
	height: number,
	format: number 
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
	favoriteGifs: FavoriteGifs;
}  
  
export interface Message {
	embeds: (ImageEmbed | GifvEmbed)[];
	attachments: Attachment[];
}

export function getFilename(url: string): string {
    const path = new URL(url).pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return filename;
}

export function constructGif(currentGifs: Record<string, Gif>, gifDetails: GifDetails): Gif {
	const maxOrder = Math.max(...Object.values(currentGifs).map(gif => gif.order));

	const newGif: Gif = {
		format: gifDetails.format,
		src: gifDetails.src,
		url: gifDetails.url,
		width: gifDetails.width,
		height: gifDetails.height,
		order: maxOrder + 1,
	};

	return newGif;
}

export function getGifDetails(message: Message): GifDetails[] {
    const gifDetailsArray: GifDetails[] = [];

    for (let embed of message.embeds) {
        if (embed.type === 'gifv') {
            gifDetailsArray.push({ 
                src: (embed as GifvEmbed).video.url,
                url: (embed as GifvEmbed).url,
                width: (embed as GifvEmbed).thumbnail.width,
                height: (embed as GifvEmbed).thumbnail.height,
                format: 2
            });
        } else if (embed.type === 'image' && embed.url.endsWith('.gif')) {
            gifDetailsArray.push({ 
                src: (embed as ImageEmbed).image.url,
                url: (embed as ImageEmbed).url, 
                width: (embed as ImageEmbed).image.width, 
                height: (embed as ImageEmbed).image.height, 
                format: 1 
            });
        }
    }
    
    for (let attachment of message.attachments) {
        if (attachment.url.endsWith('.gif')) {
            gifDetailsArray.push({ 
                src: attachment.url,
                url: attachment.url, 
                width: attachment.width, 
                height: attachment.height, 
                format: 1 
            });
        }
    }
    
    return gifDetailsArray;
}
