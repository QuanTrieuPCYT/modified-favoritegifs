import { before, after } from "@vendetta/patcher"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Message, getGifUrl } from "./util"
import { showToast } from "@vendetta/ui/toasts"
import { logger } from "@vendetta"

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const { FormRow, FormIcon } = Forms

const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, actionMessage] = ctx
    if (args !== "MessageLongPressActionSheet") return
    component.then((instance: any) => {
        const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, [])
            let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children

            const message = msgProps?.props?.message ?? actionMessage?.message as Message

            if (!buttons || !message) return
			const gifUrl = getGifUrl(message);
			if (!gifUrl) return;

			const store = findByStoreName("UserSettingsProtoStore")
			
			buttons.unshift(
                <FormRow
                    label="Add GIF to Favorites"
                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_star_filled")} />}
                    onPress={() => {
                        ActionSheet.hideActionSheet()
						showToast("Added GIF to Favorites")
						logger.log(store.frecencyWithoutFetchingLatest)
                    }}
                />)
        })
    })
})

export const onUnload = () => unpatch()