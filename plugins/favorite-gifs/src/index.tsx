import { before, after } from "@vendetta/patcher";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { FrecencyStore, Message, constructGif, createOnPressHandler, getFilename, getGifDetails } from "./util";
import { showToast } from "@vendetta/ui/toasts";
import { storage } from "@vendetta/plugin";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import settings from "./settings";

const { FormRow, FormIcon } = Forms;
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const UserSettingsProtoStore = findByStoreName("UserSettingsProtoStore");
const { addFavoriteGIF, removeFavoriteGIF } = findByProps("addFavoriteGIF", "removeFavoriteGIF");

const unpatch = before("openLazy", ActionSheet, (ctx) => {
  const [component, args, actionMessage] = ctx;
  if (args !== "MessageLongPressActionSheet") return;

  component.then((instance: any) => {
    const unpatch = after("default", instance, (_, component) => {
      React.useEffect(() => () => { unpatch() }, []);
      let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children;

      const message = msgProps?.props?.message ?? actionMessage?.message as Message;

      if (!buttons || !message) return;
      const gifDetailsArray = getGifDetails(message);
      if (!gifDetailsArray.length) return;

      for (let gifDetails of gifDetailsArray) {
        const favorites = UserSettingsProtoStore.frecencyWithoutFetchingLatest as FrecencyStore;
        const maxOrder = Math.max(...Object.values(favorites.favoriteGifs.gifs).map(gif => gif.order));

        const isGifFavorite = favorites.favoriteGifs.gifs[gifDetails.src] !== undefined || favorites.favoriteGifs.gifs[gifDetails.url] !== undefined;
        const isGifTopFavorite = favorites.favoriteGifs.gifs[gifDetails.src]?.order === maxOrder || favorites.favoriteGifs.gifs[gifDetails.url]?.order === maxOrder;

        const filename = getFilename(gifDetails.url);

        buttons.unshift(
          <FormRow
            label={isGifFavorite ? `Remove ${filename} from Favorites` : `Add ${filename} to Favorites`}
            leading={<FormIcon style={{ opacity: 1 }} source={isGifFavorite ? getAssetIDByName("ic_clear") : getAssetIDByName("ic_star_filled")} />}
            onPress={createOnPressHandler(gifDetails, favorites, isGifFavorite, filename)}
          />
        );

        if (isGifFavorite && !isGifTopFavorite) {
          buttons.unshift(
            <FormRow
              label={`Bump ${filename} to the top of Favorites`}
              leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_activity_24px")} />}
              onPress={
				() => {
						ActionSheet.hideActionSheet();

						if (storage.confirm) {
							showConfirmationAlert({
								title: "Bump Favorite",
								content: `Are you sure you want to bump ${filename} to the top of your favorites?`,
								confirmText: "Bump",
								onConfirm: () => {
									removeFavoriteGIF(gifDetails.url);
									addFavoriteGIF(constructGif(favorites.favoriteGifs.gifs, gifDetails));
									showToast(`Bumped ${filename} to the top of Favorites`, getAssetIDByName("check"));
								}
							});
						}				
						else {
							removeFavoriteGIF(gifDetails.url);
							addFavoriteGIF(constructGif(favorites.favoriteGifs.gifs, gifDetails));
							showToast(`Bumped ${filename} to the top of Favorites`, getAssetIDByName("check"));
						}
					}
				}
            />
          );
        }
      }
    });
  });
});

export default {
  onUnload: () => unpatch(),
  settings
};