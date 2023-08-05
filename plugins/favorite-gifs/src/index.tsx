import { before, after } from "@vendetta/patcher"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { FrecencyStore, Gif, Message, constructGif, getGifDetails } from "./util"
import { showToast } from "@vendetta/ui/toasts"

const { FormRow, FormIcon } = Forms
const ActionSheet = findByProps("openLazy", "hideActionSheet")
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

			buttons.unshift(
                <FormRow
                    label="Add GIF to Favorites"
                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_star_filled")} />}
                    onPress={() => {
                        ActionSheet.hideActionSheet()

						const newGif = constructGif(favorites.favoriteGifs.gifs, gifDetails)

						favorites.updateAsync("favoriteGifs", state => {
                            state.gifs[newGif.src] = {
                                ...newGif,
                                order: Math.max(...Object.values(state.gifs as Record<string, Gif>).map(g => g.order)) + 1
                            }
                        }, 0)

						showToast("Added GIF to Favorites")
                    }}
                />)
        })
    })
})

export const onUnload = () => unpatch()