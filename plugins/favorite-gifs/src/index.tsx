import { before, after } from "@vendetta/patcher"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { FrecencyStore, Message, constructGif, getFilename, getGifDetails } from "./util"
import { showToast } from "@vendetta/ui/toasts"
import { showConfirmationAlert } from "@vendetta/ui/alerts"

const { FormRow, FormIcon } = Forms
const ActionSheet = findByProps("openLazy", "hideActionSheet")
const UserSettingsProtoStore = findByStoreName("UserSettingsProtoStore");
const { addFavoriteGIF, removeFavoriteGIF } = findByProps("addFavoriteGIF", "removeFavoriteGIF");

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
				const favorites = UserSettingsProtoStore.frecencyWithoutFetchingLatest as FrecencyStore;
				const maxOrder = Math.max(...Object.values(favorites.favoriteGifs.gifs).map(gif => gif.order));

				const isGifFavorite = favorites.favoriteGifs.gifs[gifDetails.src] !== undefined || favorites.favoriteGifs.gifs[gifDetails.url] !== undefined;
				const isGifTopFavorite = favorites.favoriteGifs.gifs[gifDetails.src]?.order === maxOrder || favorites.favoriteGifs.gifs[gifDetails.url]?.order === maxOrder;

				const filename = getFilename(gifDetails.url);
			
				buttons.unshift(
					<FormRow
						label= { isGifFavorite ? `Remove ${filename} from Favorites` : `Add ${filename} to Favorites` }
						leading={<FormIcon style={{ opacity: 1 }} source={ isGifFavorite ? getAssetIDByName("ic_clear") : getAssetIDByName("ic_star_filled") } />}
						onPress={() => {
							ActionSheet.hideActionSheet()
			
							if (isGifFavorite) {
								removeFavoriteGIF(gifDetails.url)
								showToast(`Removed ${filename} from Favorites`, getAssetIDByName("check"))
							} else {
								if (gifDetails.isVideo) {
									showConfirmationAlert({
										title: "Add video to Favorites",
										content: "If a video is the first entry in the GIF picker, on mobile this breaks the picker until a new valid item is added or the video is removed. It will only show on Desktop.",
										confirmText: "Add to Favorites",
										cancelText: "Cancel",
										onConfirm: () => {
											addFavoriteGIF(constructGif(favorites.favoriteGifs.gifs, gifDetails))
											showToast(`Added ${filename} to Favorites`, getAssetIDByName("check"))
										}
									})
									return
								}
								addFavoriteGIF(constructGif(favorites.favoriteGifs.gifs, gifDetails))
								showToast(`Added ${filename} to Favorites`, getAssetIDByName("check"))
							}
						}}
					/>
				)

				if (isGifFavorite && !isGifTopFavorite) {
					buttons.unshift(
						<FormRow
							label={`Bump ${filename} to the top of Favorites`}
							leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_activity_24px")} />}
							onPress={() => {
								ActionSheet.hideActionSheet()

								removeFavoriteGIF(gifDetails.url)
								addFavoriteGIF(constructGif(favorites.favoriteGifs.gifs, gifDetails))
								showToast(`Bumped ${filename} to the top of Favorites`, getAssetIDByName("check"))
							}}
						/>
					)
				}
			}			
		})
	})
})

export default {
	onUnload: () => unpatch(),
}