
function removeTsLoaders(common) {
    let foundTypescriptLoaderIndex = -1
    do {
        foundTypescriptLoaderIndex = common.module.rules.findIndex(function(value, index, obj) {
            let reg = /\.ts$/
            if ( !!value && value.test.source === reg.source ) {
                if ( value.loader === 'awesome-typescript-loader' ) {
                    return true;
                }
                if ( value.use ) {
                    for ( let item of value.use ) {
                        if ( item.loader === 'awesome-typescript-loader' ) {
                            return true;
                        }
                    }
                }
            }
            return false;
        });

        if ( foundTypescriptLoaderIndex > -1 ) {
            common.module.rules.splice(foundTypescriptLoaderIndex, 1);
        }
    } while (foundTypescriptLoaderIndex > -1);
}

exports.removeTsLoaders =  removeTsLoaders;