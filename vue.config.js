module.exports = {
    devServer: {
	disableHostCheck: true,
        proxy: {
            '/api' : {
                target: 'http://wodnd999999.iptime.org:8080',
                ws: true,
                changeOrigin: true
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
