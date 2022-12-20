require('esbuild').build({
    entryPoints: ['src/index.js'],
    outfile: 'bin/out.js',
    platform: "node",
    bundle: true,
    watch: {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else console.log('watch build succeeded:', result)
        },
    },
}).then(result => {
    console.log("watching......")
})