export default {
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extension: [
          '.js'
        ],
        alias: {
          "@/": "./"
          // Thêm các alias khác nếu cần
        }
      }
    ]
  ]
}
