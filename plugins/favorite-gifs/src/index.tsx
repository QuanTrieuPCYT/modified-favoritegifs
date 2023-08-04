import { before, after } from "@vendetta/patcher"
import { findByProps } from "@vendetta/metro"
import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { getAssetIDByName } from "@vendetta/ui/assets"

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const { FormRow, FormIcon } = Forms

const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, actionMessage] = ctx
    if (args !== "MessageLongPressActionSheet") return
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, [])
            let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children

            const message = msgProps?.props?.message ?? actionMessage?.message

            if (!buttons || !message) return
			
			buttons.push(
                <FormRow
                    label="Add GIF to Favorites"
                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_star_filled")} />}
                    onPress={() => {
                        ActionSheet.hideActionSheet()
                    }}
                />)
        })
    })
})

export const onUnload = () => unpatch()