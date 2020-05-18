module.exports = {
    devServer: {
        proxy: {
            '/api' : {
                target: 'http://localhost:9000/api',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api':''
                }
            },
        }

    },

}