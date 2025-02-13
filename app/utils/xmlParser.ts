import { XMLParser } from "fast-xml-parser";
import { type ITunesLibrary, Playlist, Track } from "../types/iTunesLibrary";

const isKey = (item: any) => item.key !== undefined;
const isInteger = (item: any) => item.integer !== undefined;
const isString = (item: any) => item.string !== undefined;
const isDate = (item: any) => item.date !== undefined;
const isDict = (item: any) => item.dict !== undefined;
const isTrue = (item: any) => item.true !== undefined;
const isFalse = (item: any) => item.false !== undefined;
const isArray = (item: any) => item.array !== undefined;
const isData = (item: any) => item.data !== undefined;
const handleKey = (item: any) => item.key[0]["#text"];
const handleInteger = (item: any) =>
	Number.parseInt(item.integer[0]["#text"], 10);
const handleString = (item: any) => item.string[0]?.["#text"];
const handleDate = (item: any) => item.date[0]["#text"];
const handleTrue = (item: any) => true;
const handleFalse = (item: any) => false;
const handleData = (item: any) => item.data[0]["#text"];

const getValueOrThrow = (i: number, row: any) => {
	const nextItem = row[i + 1];
	if (isKey(nextItem)) {
		throw new Error(
			`Unexpected key when looking for value. Index ${i}, key: ${nextItem.key[0]["#text"]}`,
		);
	}
	return nextItem;
};

const handleRow = (row: any): any => {
	const parsedRow: any = {};
	for (let i = 0; i < row.length; i++) {
		const item = row[i];
		if (isKey(item)) {
			const keyValue = handleKey(item);
			const value = getValueOrThrow(i, row);

			try {
				if (isInteger(value)) {
					parsedRow[keyValue] = handleInteger(value);
				} else if (isString(value)) {
					parsedRow[keyValue] = handleString(value) || "undefined";
				} else if (isDate(value)) {
					parsedRow[keyValue] = handleDate(value);
				} else if (isTrue(value)) {
					parsedRow[keyValue] = handleTrue(value);
				} else if (isFalse(value)) {
					parsedRow[keyValue] = handleFalse(value);
				} else if (isDict(value)) {
					parsedRow[keyValue] = handleRow(value.dict);
				} else if (isArray(value)) {
					parsedRow[keyValue] = value.array.map((item: any) =>
						handleRow(item.dict),
					);
				} else if (isData(value)) {
					parsedRow[keyValue] = handleData(value);
				} else {
					throw new Error(
						`Unexpected value type when looking for value. Index ${i}, key: ${value}`,
					);
				}
			} catch (error) {
				console.error("Error trying to parse row", {
					item,
					keyValue,
					value,
					row,
					index: i,
					error,
				});
			}

			i++;
		}
	}
	return parsedRow;
};

export async function parseITunesLibrary(
	xmlContent: string,
): Promise<ITunesLibrary> {
	const parser = new XMLParser({ preserveOrder: true });
	const raw = parser.parse(xmlContent);
	const data = raw[1].plist[0].dict;
	return handleRow(data) as ITunesLibrary;
}
