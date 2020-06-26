module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://101.101.208.224:8080/",
        ws: true,
        changeOrigin: true,
      },
      "/object": {
        target: "http://kr.object.ncloudstorage.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/object": "",
        },
      },
    },
  },
};
