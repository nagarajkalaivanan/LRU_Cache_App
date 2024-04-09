package services

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	clients   = make(map[*websocket.Conn]bool)
	broadcast = make(chan map[string]interface{})
	mutex     = &sync.Mutex{}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WsHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}
	defer conn.Close()

	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
	mutex.Lock()
	delete(clients, conn)
	mutex.Unlock()
}

func BroadcastCacheUpdates() {
	for {
		select {
		case data := <-broadcast:
			mutex.Lock()
			for client := range clients {
				if err := client.WriteJSON(data); err != nil {
					delete(clients, client)
					client.Close()
				}
			}
			mutex.Unlock()
		}
	}

}

func GetCache(c *gin.Context, cache *LRUCache) {
	//cache := NewLRUCache(10, time.Second*5)
	key := c.Param("key")

	if value, ok := cache.Get(key); ok {
		c.JSON(200, gin.H{"key": key, "value": value})
	} else {
		c.JSON(404, gin.H{"error": "key not found"})
	}
}

func SetCache(c *gin.Context, cache *LRUCache) {
	//cache := NewLRUCache(10, time.Second*1000)
	key := c.Param("key")
	var jsonBody struct {
		Value      interface{} `json:"value"`
		Expiration int         `json:"expiration"`
	}
	if err := c.BindJSON(&jsonBody); err != nil {
		c.JSON(400, gin.H{"error": "invalid request body"})
		return
	}
	cache.Set(key, jsonBody.Value)
	broadcast <- map[string]interface{}{
		"key":        key,
		"value":      jsonBody.Value,
		"expiration": time.Now().Add(time.Duration(jsonBody.Expiration) * time.Second),
	}
	time.AfterFunc(time.Duration(jsonBody.Expiration)*time.Second, func() {
		cache.Delete(key)
	})
	c.JSON(200, gin.H{"message": "cache item set"})

}

func DeleteCache(c *gin.Context, cache *LRUCache) {

	//cache := NewLRUCache(10, time.Second*5)
	key := c.Param("key")
	cache.Delete(key)
	c.JSON(200, gin.H{"message": "cache item deleted"})

}

type CacheItem struct {
	Value      interface{}
	Expiration time.Time
}

type LRUCache struct {
	cache      map[string]*CacheItem
	capacity   int
	llMutex    sync.Mutex
	expiration time.Duration
}

func NewLRUCache(capacity int, expiration time.Duration) *LRUCache {
	return &LRUCache{
		cache:      make(map[string]*CacheItem),
		capacity:   capacity,
		llMutex:    sync.Mutex{},
		expiration: expiration,
	}
}

func (c *LRUCache) Get(key string) (interface{}, bool) {
	c.llMutex.Lock()
	defer c.llMutex.Unlock()

	item, exists := c.cache[key]
	if !exists || item.Expiration.Before(time.Now()) {
		delete(c.cache, key)
		return nil, false
	}
	item.Expiration = time.Now().Add(c.expiration)
	return item.Value, true
}
func (c *LRUCache) Set(key string, value interface{}) {
	c.llMutex.Lock()
	defer c.llMutex.Unlock()

	if len(c.cache) >= c.capacity {
		c.evictOldest()
	}

	c.cache[key] = &CacheItem{
		Value:      value,
		Expiration: time.Now().Add(c.expiration),
	}
}

func (c *LRUCache) Delete(key string) {
	c.llMutex.Lock()
	defer c.llMutex.Unlock()
	delete(c.cache, key)
}

func (c *LRUCache) evictOldest() {
	var oldestKey string
	var oldestExpiration time.Time

	for key, item := range c.cache {
		if oldestExpiration.IsZero() || item.Expiration.Before(oldestExpiration) {
			oldestKey = key
			oldestExpiration = item.Expiration
		}
	}

	delete(c.cache, oldestKey)
}
