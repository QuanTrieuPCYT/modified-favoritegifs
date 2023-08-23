import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms, General } from "@vendetta/ui/components";

const { ScrollView } = General;
const { FormSection, FormSwitchRow, FormIcon } = Forms;

export default () =>  {
	useProxy(storage);
  
	return (
	  <ScrollView style={{ flex: 1 }}>
		<FormSection title="Character replacement settings" >
			<FormSwitchRow
				label="Force lowercase"
				subLabel="Convert all characters to lowercase"
				leading={<FormIcon source={getAssetIDByName("ic_add_text")} />}
				value={ storage.lowercase ?? false }
				onValueChange={ (value: boolean) => {
					storage.lowercase = value;
				}}
			/>
			<FormSwitchRow
				label="Emoji"
				subLabel="Convert emoji to ASCII"
				leading={<FormIcon source={getAssetIDByName("SmileIcon")} />}
				value={storage.emoji ?? false}
				onValueChange={ (value: boolean) => {
					storage.emoji = value;
				}}
			/>
			<FormSwitchRow
				label="Korean"
				subLabel="Convert Korean to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={storage.korean ?? false}
				onValueChange={ (value: boolean) => {
					storage.korean = value;
				}}
			/>
			<FormSwitchRow
				label="Japanese"
				subLabel="Convert Japanese to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={ storage.japanese ?? false }
				onValueChange={ (value: boolean) => {
					storage.japanese = value;
				}}
			/>
			<FormSwitchRow
				label="Chinese"
				subLabel="Convert Chinese to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={ storage.chinese ?? false }
				onValueChange={ (value: boolean) => {
					storage.chinese = value;
				}}
			/>
			<FormSwitchRow
				label="Cyrillic"
				subLabel="Convert Cyrillic to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={ storage.cyrillic ?? false }
				onValueChange={ (value: boolean) => {
					storage.cyrillic = value;
				}}
			/>
			<FormSwitchRow
				label="Greek"
				subLabel="Convert Greek to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={ storage.greek ?? false }
				onValueChange={ (value: boolean) => {
					storage.greek = value;
				}}
			/>
			<FormSwitchRow
				label="Hebrew"
				subLabel="Convert Hebrew to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={ storage.hebrew ?? false }
				onValueChange={ (value: boolean) => {
					storage.hebrew = value;
				}}
			/>
			<FormSwitchRow
				label="Arabic"
				subLabel="Convert Arabic to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={ storage.arabic ?? false }
				onValueChange={ (value: boolean) => {
					storage.arabic = value;
				}}
			/>
			<FormSwitchRow
				label="Thai"
				subLabel="Convert Thai to ASCII"
				leading={<FormIcon source={getAssetIDByName("ic_globe_24px")} />}
				value={ storage.thai ?? false }
				onValueChange={ (value: boolean) => {
					storage.thai = value;
				}}
			/>
		</FormSection>
	  </ScrollView>
	);
}