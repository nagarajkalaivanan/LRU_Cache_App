package config

// import (
// 	"sync"
// 	"time"
// )

//  var (
// 	Cache *LRUCache
//  )

// type CacheItem struct {
// 	Value      interface{}
// 	Expiration time.Time
// }

// type LRUCache struct {
// 	cache      map[string]*CacheItem
// 	capacity   int
// 	llMutex    sync.Mutex
// 	expiration time.Duration
// }

// func NewLRUCache(capacity int, expiration time.Duration) *LRUCache {
// 	return &LRUCache{
// 		cache:      make(map[string]*CacheItem),
// 		capacity:   capacity,
// 		llMutex:    sync.Mutex{},
// 		expiration: expiration,
// 	}
// }

// func init() {

// 	Cache := NewLRUCache(10, time.Second*1000)
// }
