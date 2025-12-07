async function instantiate(module, imports = {}) {
  // api WebAssembly
  const { exports } = await WebAssembly.instantiate(module, imports)
  // 获取到内存
  const memory = exports.memory || imports.env.memory
  return exports
}

export const { add, memory } = await (async (url) =>
  instantiate(
    await (async () => {
      // 当前环境是否是 node 或 bun
      const isNodeorBun = typeof process !== 'undefined' && process.version !== null && (process.versions.node !== null || process.versions.bun !== null)
      if (isNodeorBun) {
        // node: WebAssembly.compile
        // 读取文件
        const fs = await import('fs/promises')
        return globalThis.WebAssembly.compile(await fs.readFile(url))
      } else {
        // 浏览器：WebAssembly.compileStreaming
        return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url))
      }
    })(),
    {}
  ))(new URL('release.wasm', import.meta.url))
