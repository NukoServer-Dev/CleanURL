export var paramData: Map<string, string[]> = new Map();

export async function loadParams(fileName: string = "paramData") {
    const file = Bun.file("./data/" + fileName + ".json");
    paramData =  new Map<string, string[]>(Object.entries(await file.json()));
    console.log(`${fileName}をロードしました。`)
}

export async function reloadParams(fileName: string = "paramData") {
    const file = Bun.file("./data/" + fileName + ".json");
    paramData = new Map<string, string[]>(Object.entries(await file.json()));
    console.log(`${fileName}をリロードしました。`)
}