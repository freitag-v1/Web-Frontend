module.exports = {
    devServer: {
        proxy: {
            '/api/user' : {
                target: 'http://localhost:9000/api',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api':''
                }
            },
            '/api/project' : {
                target: 'http://localhost:8084/api',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api':''
                }
            }
        }

    }
}