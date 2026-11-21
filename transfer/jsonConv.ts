interface Param {
  type: "black" | "white";
  items: string[];
}

const file = Bun.file("./data/paramData.json");
const rawData = (await file.json()) as Record<string, string[]>;

const convParamData: Record<string, Param> = {};

for (const [key, value] of Object.entries(rawData)) {
  convParamData[key] = {
    type: "black",
    items: value,
  };
}

await Bun.write("paramData.json", JSON.stringify(convParamData, null, 2) + "\n");
