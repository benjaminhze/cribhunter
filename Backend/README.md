# Property Hunter Backend API

FastAPI backend for the Property Hunter application with Supabase integration.

## 🚀 Features

- **FastAPI** - Modern, fast web framework for building APIs
- **Supabase Integration** - Database and authentication
- **JWT Authentication** - Secure token-based authentication
- **CORS Support** - Cross-origin resource sharing for frontend
- **Pydantic Models** - Data validation and serialization
- **Type Hints** - Full type safety throughout the codebase

## 📋 Prerequisites

- Python 3.8 or higher
- Supabase account and project

## 🛠️ Setup

### Option 1: Automatic Setup (Recommended)

```bash
# Run the setup script
python setup.py
```

### Option 2: Manual Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate virtual environment:**
   - Windows: `venv\\Scripts\\activate`
   - Unix/Linux/Mac: `source venv/bin/activate`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

## 🔧 Configuration

Edit the `.env` file with your configuration:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# FastAPI Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

## 🚀 Running the Server

### Development Mode (with auto-reload):
```bash
python main.py
```

### Production Mode:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### With custom settings:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --log-level info
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user profile

### Properties
- `GET /api/properties/` - Get all properties (with filters)
- `GET /api/properties/{id}` - Get specific property
- `POST /api/properties/` - Create new property (agents only)
- `PUT /api/properties/{id}` - Update property (owner only)
- `DELETE /api/properties/{id}` - Delete property (owner only)
- `GET /api/properties/user/{user_id}` - Get user's properties

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

## 🗄️ Database Schema

The API expects the following Supabase tables:

### Users Table
```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('hunter', 'agent')),
    phone VARCHAR(8),
    agent_license VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    size DECIMAL(10,2) NOT NULL,
    property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('hdb', 'condo', 'landed')),
    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('rent', 'sale')),
    features TEXT[],
    amenities TEXT[],
    images TEXT[],
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(8) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🌐 CORS

The API is configured to allow requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (React dev server)
- http://127.0.0.1:5173 (Alternative localhost)

## 🧪 Testing

Test the API endpoints using the interactive documentation at http://localhost:8000/docs or use tools like Postman or curl.

### Example: Register a new user
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "user_type": "hunter",
       "password": "password123"
     }'
```

### Example: Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "password123"
     }'
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in the uvicorn command
2. **Supabase connection failed**: Check your .env file credentials
3. **Import errors**: Make sure you're in the virtual environment
4. **CORS errors**: Check ALLOWED_ORIGINS in .env file

### Logs

Check the console output for detailed error messages and logs.

## 📝 Development

### Project Structure
```
Backend/
├── main.py              # FastAPI application
├── models.py            # Pydantic models
├── database.py          # Supabase client
├── auth.py              # Authentication utilities
├── routes/              # API routes
│   ├── __init__.py
│   ├── auth.py          # Authentication routes
│   ├── users.py         # User management routes
│   └── properties.py    # Property management routes
├── requirements.txt     # Python dependencies
├── setup.py            # Setup script
└── README.md           # This file
```

### Adding New Features

1. Create new models in `models.py`
2. Add new routes in `routes/` directory
3. Update database schema in Supabase
4. Test endpoints using Swagger UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
