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
  const html = Bun.file("./src/index.html");
  const text = await html.text();
  return render(text.toString(), globalThis);
}
