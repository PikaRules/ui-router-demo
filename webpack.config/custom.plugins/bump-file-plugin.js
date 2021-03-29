// https://webpack.js.org/development/how-to-write-a-plugin/#example

/**
 * Write the options.data object into a file
 * @param {*} options options{filename: string, data: object}
 */
function BumpFilePlugin(options) {
  this.options = options;

  var throwError = function() {
      throw new Error("Bad arguments. valid arguments: {filename: string, data: object}");
  }

  if ( !options ) { throwError(); }
  if ( typeof options.filename !== "string" || typeof options.data !== "object" ) { throwError(); }
};

BumpFilePlugin.prototype.apply = function(compiler) {
  let options = this.options;
  compiler.plugin('emit', function(compilation, callback) {

    let fileData = JSON.stringify(options.data);
    compilation.assets[options.filename] = {
      source: function() {
        return fileData;
      },
      size: function() {
        return fileData.length;
      }
    };

    callback();
  });
};

module.exports = BumpFilePlugin;