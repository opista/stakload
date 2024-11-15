import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ trimValues: true });

export const parseXml = (str: string) => parser.parse(str);
