package main

import (
	"GO_LRU_Cache/services"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control", "StaffId", "CustID", "RefreshToken"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	cache := services.NewLRUCache(10, time.Second*5)

	r.GET("/cache/:key", func(c *gin.Context) {
		services.GetCache(c, cache)
	})
	r.POST("/cache/:key", func(c *gin.Context) {
		services.SetCache(c, cache)
	})
	r.DELETE("/cache/:key", func(c *gin.Context) {
		services.DeleteCache(c, cache)
	})

	r.GET("/ws", func(c *gin.Context) {
		services.WsHandler(c)
	})

	go services.BroadcastCacheUpdates()
	// routes.GetCache(r)
	// routes.SetCache(r)
	// routes.DeleteCache(r)

	r.Run(":8080")
}
