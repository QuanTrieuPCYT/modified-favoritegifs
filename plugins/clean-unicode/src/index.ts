import { after } from "@vendetta/patcher";
import { findByName, findByStoreName } from "@vendetta/metro";
import settings from "./settings";
import { clean } from "./util";

const RowManager = findByName("RowManager");
const UserStore = findByStoreName("UserStore");

let unpatch: Function;

const onLoad = () => {
  unpatch = after("generate", RowManager.prototype, ([row], { message }) => {
    if (row.rowType !== 1) return;

    const user = row.message.author;
    if (!user) return;
    if (user.bot && user.discriminator == "0000") return;

	if (row.message?.nick) {
		const cleanedName = clean(row.message.nick);
		message.username = message.username.replace(row.message.nick, cleanedName);
	}

	if (message.referencedMessage?.message?.username) {
		const replyMessage = message.referencedMessage.message;
		const user = UserStore.getUser(replyMessage.authorId);
  
		if (!user) return;
		if (user.bot && user.discriminator == "0000") return;	

		const cleanedName = clean(replyMessage.username);

		if (cleanedName !== replyMessage.username) {
			replyMessage.username = replyMessage.username.replace(replyMessage.username, cleanedName);
		}
	}
  });
};

export default {
	// onLoad,
	onUnload: () => unpatch?.(),
	settings
}