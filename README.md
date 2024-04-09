# LRU_Cache_App
This project implements a simple LRU (Least Recently Used) cache system using Golang (with Gin framework) for the backend and React (with TypeScript) for the frontend. The application allows users to view, add, and delete key-value pairs in an LRU cache through a web interface.

Project Structure
The project consists of two main components:

Backend (Golang with Gin)

Handles API endpoints for interacting with the LRU cache.
Uses Gorilla WebSocket for real-time updates.

Frontend (React with TypeScript)

Provides a user interface to view and manage LRU cache items.
Uses Axios for making HTTP requests to the backend API.

Usage
View Cache Items:

Use the CacheViewer component to get value of the cache using key.
Enter a key , then click "Get" to get the key:value pair in the cache.

Set Cache Items:

Use the Cache Setter component to add new key-value pairs to the cache.
Enter a key and value, then click "Set" to store the item in the cache.

Delete Cache Items:

Enter a key , then click "Delete" to delete the item in the cache.


   
