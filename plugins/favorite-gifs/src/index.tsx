import { before, after } from "@vendetta/patcher"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { FrecencyStore, Message, constructGif, getGifDetails } from "./util"
import { showToast } from "@vendetta/ui/toasts"

const { FormRow, FormIcon } = Forms
const ActionSheet = findByProps("openLazy", "hideActionSheet")
const { addFavoriteGIF, removeFavoriteGIF } = findByProps("addFavoriteGIF", "removeFavoriteGIF");
const favorites = findByStoreName("UserSettingsProtoStore").frecencyWithoutFetchingLatest as FrecencyStore

const unpatch = before("openLazy", ActionSheet, (ctx) => {
	const [component, args, actionMessage] = ctx
	if (args !== "MessageLongPressActionSheet") return
	component.then((instance: any) => {
		const unpatch = after("default", instance, (_, component) => {
			React.useEffect(() => () => { unpatch() }, [])
			let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children

			const message = msgProps?.props?.message ?? actionMessage?.message as Message

			if (!buttons || !message) return
			const gifDetails = getGifDetails(message)
			if (!gifDetails) return

			const isGifFavorite = favorites.favoriteGifs.gifs[gifDetails.src] !== undefined || favorites.favoriteGifs.gifs[gifDetails.url] !== undefined;

			buttons.unshift(
				<FormRow
					label= { isGifFavorite ? "Remove from Favorites" : "Add to Favorites" }
					leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_star_filled")} />}
					onPress={() => {
						ActionSheet.hideActionSheet()

						if (isGifFavorite) {
							removeFavoriteGIF(gifDetails.url)
							showToast("Removed from Favorites", 855)
						} else {
							addFavoriteGIF(constructGif(favorites.favoriteGifs.gifs, gifDetails))
							showToast("Added to Favorites", 855)
						}
					}}
				/>)
		})
	})
})

export const onUnload = () => unpatch()