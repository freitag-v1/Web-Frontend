module.exports = {
    devServer: {
	disableHostCheck: true,
        proxy: {
            '/api' : {
                target: 'http://localhost:9000',
                ws: true,
                changeOrigin: true,
            },
	    '/object' : {
                target: 'http://kr.object.ncloudstorage.com',
		ws: true,
		changeOrigin: true,
		pathRewrite: {
                    '^/object':''
		}
	    }
        }

    },

}
