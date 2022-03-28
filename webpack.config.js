
const fs = require('fs');

// remove project in console

class RemoveLogs {
  constructor(options) {
    this.deleteConsole = options.deleteConsole;
  }

  apply(compiler) {
    let that = this;

    compiler.hooks.emit.tap('DelConsole', compilation => {
      // 探索每个块（构建后的输出）
      compilation.chunks.forEach(chunk => {
        // 探索块生成的每个资源文件名
        chunk.files.forEach(filename => {
          var source = compilation.assets[filename].source();
          // 删除console语句
          if (that.deleteConsole) {
            source = source.replace(/console\.(log|dir|info)\(.*?\);?/g, '');
          }
          // 返回
          compilation.assets[filename] = {
            source() {
              return source;
            },
            size() {
              return source.length;
            }
          }
        });
      });
    });
  }
}

module.exports = {
  mode: 'development',
  entry: './index.js',
  plugins: [new RemoveLogs({ deleteConsole: true })]
}