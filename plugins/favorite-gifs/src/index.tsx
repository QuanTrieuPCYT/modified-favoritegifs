import { before, after } from "@vendetta/patcher"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { FrecencyStore, Message, constructGif, getFilename, getGifDetails } from "./util"
import { showToast } from "@vendetta/ui/toasts"

const { FormRow, FormIcon } = Forms
const ActionSheet = findByProps("openLazy", "hideActionSheet")
const { addFavoriteGIF, removeFavoriteGIF } = findByProps("addFavoriteGIF", "removeFavoriteGIF");
const UserSettingsProtoStore = findByStoreName("UserSettingsProtoStore");
const favorites = UserSettingsProtoStore.frecencyWithoutFetchingLatest as FrecencyStore;

const unpatch = before("openLazy", ActionSheet, (ctx) => {
	const [component, args, actionMessage] = ctx
	if (args !== "MessageLongPressActionSheet") return
	component.then((instance: any) => {
		const unpatch = after("default", instance, (_, component) => {
			React.useEffect(() => () => { unpatch() }, [])
			let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children

			const message = msgProps?.props?.message ?? actionMessage?.message as Message

			if (!buttons || !message) return
			const gifDetailsArray = getGifDetails(message)
			if (!gifDetailsArray.length) return

			for (let gifDetails of gifDetailsArray) {
				const isGifFavorite = favorites.favoriteGifs.gifs[gifDetails.src] !== undefined || favorites.favoriteGifs.gifs[gifDetails.url] !== undefined;
				const filename = getFilename(gifDetails.url);
			
				let label = '';
				if (gifDetailsArray.length > 1) {
					label = isGifFavorite ? `Remove ${filename} from Favorites` : `Add ${filename} to Favorites`;
				} else {
					label = isGifFavorite ? 'Remove from Favorites' : 'Add to Favorites';
				}
			
				buttons.unshift(
					<FormRow
						label= { label }
						leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_star_filled")} />}
						onPress={() => {
							ActionSheet.hideActionSheet()
			
							if (isGifFavorite) {
								removeFavoriteGIF(gifDetails.url)
								showToast(`Removed ${filename} from Favorites`, getAssetIDByName("ic_checkmark"))
							} else {
								addFavoriteGIF(constructGif(favorites.favoriteGifs.gifs, gifDetails))
								showToast(`Added ${filename} to Favorites`, getAssetIDByName("ic_checkmark"))
							}
						}}
					/>
				)
			}
		})
	})
})

export const onUnload = () => unpatch()