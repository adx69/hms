# Troubleshooting MongoDB Connection Issues

## Error: `querySrv ETIMEOUT _mongodb._tcp.cluster0.juhchz4.mongodb.net`

This error indicates that the DNS lookup for the MongoDB SRV record is timing out. Here are several solutions:

### Solution 1: Check Network Connection
- Ensure you have an active internet connection
- Check if you're behind a firewall that might be blocking MongoDB connections
- Try accessing MongoDB Atlas dashboard to verify cluster status

### Solution 2: Use Environment Variable
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://venom:123@cluster0.juhchz4.mongodb.net/hospital-management?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
```

### Solution 3: Try Direct Connection String
If SRV connection fails, try using a direct connection string. Get it from MongoDB Atlas:
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

### Solution 4: Check MongoDB Atlas Whitelist
1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access"
3. Add your IP address or use `0.0.0.0/0` for development (not recommended for production)

### Solution 5: Verify Cluster Status
1. Check if your MongoDB cluster is running
2. Verify the cluster name and connection string are correct
3. Ensure the database user credentials are correct

### Solution 6: Use Alternative Connection Options
If you have a local MongoDB instance, you can use:
```env
MONGODB_URI=mongodb://localhost:27017/hospital-management
```

### Solution 7: Test Connection Manually
You can test the connection using MongoDB Compass or mongo shell:
```bash
mongosh "mongodb+srv://venom:123@cluster0.juhchz4.mongodb.net/hospital-management"
```

### Solution 8: Increase Timeout Settings
The connection now has increased timeout settings (10 seconds) in `src/lib/mongodb.js`. If you need more time, you can adjust:
- `serverSelectionTimeoutMS`: Time to wait for server selection
- `socketTimeoutMS`: Time to wait for socket operations
- `connectTimeoutMS`: Time to wait for initial connection

### Common Issues:
1. **Firewall blocking**: Corporate firewalls often block MongoDB connections
2. **VPN interference**: Some VPNs interfere with DNS resolution
3. **DNS issues**: Your DNS might not resolve the SRV record
4. **Cluster paused**: MongoDB Atlas free tier clusters pause after inactivity

### Quick Fix:
If you're in a hurry, you can temporarily use a local MongoDB instance or MongoDB Atlas with a different connection method.

