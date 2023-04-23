import * as fs from "fs";

function render(template: string, data: any): string {
  template = `
    with(data) {
      let str = ''
      str += \`${template}\`
      return str
    }
  `

  template = template.replace(/<%=(.+?)%>/g, (...args) => {
    return '${' + args[1] + '}'
  })
  const res = new Function('data', template)(data)
  return res
}



export async function renderer() {
  const text = fs.readFileSync("./src/index.html");
  return render(text.toString(), globalThis);
}
