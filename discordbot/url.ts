export interface Param {
  type: "black" | "white";
  items: string[];
}

export var paramData: Map<string, Param> = new Map();

export async function loadParams(fileName: string = "paramData") {
    const file = Bun.file("./data/" + fileName + ".json");
    paramData =  new Map<string, Param>(Object.entries(await file.json()));
    console.log(`${fileName}をロードしました。`)
}

export async function reloadParams(fileName: string = "paramData") {
    const file = Bun.file("./data/" + fileName + ".json");
    paramData = new Map<string, Param>(Object.entries(await file.json()));
    console.log(`${fileName}をリロードしました。`)
}

export function countParams() {
    return paramData.size
}
