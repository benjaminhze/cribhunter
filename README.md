# CribHunter - Property Management App

A full-stack property management application with React frontend and FastAPI backend, designed for finding and managing property listings in Singapore.

## Features

- 🔍 Property search and filtering
- 🗺️ Interactive map integration
- ❤️ Favorites system
- 👤 User authentication
- 📱 Responsive design
- 🏠 Property listing management

## Prerequisites

- Python 3.8+ 
- Node.js 16+
- npm or yarn
- Supabase account (for database)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/benjaminhze/cribhunter.git
cd cribhunter
```

### 2. Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   - Create a `.env` file in the Backend directory
   - **Contact the project lead for shared Supabase credentials**
   - Add the shared Supabase credentials:
   ```
   SUPABASE_URL=shared_supabase_url
   SUPABASE_KEY=shared_supabase_key
   ```

6. Set up the database:
   - **The database is already set up with shared credentials**
   - No additional database setup required for teammates

7. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### 3. Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Running the Application

1. **Start the backend server** (from Backend directory):
   ```bash
   uvicorn main:app --reload
   ```

2. **Start the frontend server** (from Frontend directory):
   ```bash
   npm run dev
   ```

3. **Open your browser** and go to `http://localhost:5173`

## Project Structure

```
cribhunter/
├── Backend/
│   ├── routes/           # API route handlers
│   ├── models.py         # Database models
│   ├── database.py       # Database connection
│   ├── main.py          # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── *.sql            # Database schema files
├── Frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── services/     # API services
│   │   └── data/         # Static data
│   ├── package.json      # Node.js dependencies
│   └── vite.config.ts    # Vite configuration
└── README.md
```

## Technology Stack

### Backend
- **FastAPI** - Web framework
- **Supabase** - Database and authentication
- **Python** - Programming language
- **Uvicorn** - ASGI server

### Frontend
- **React** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Leaflet** - Map integration

## Environment Variables

Create a `.env` file in the Backend directory with:

```
SUPABASE_URL=shared_supabase_url
SUPABASE_KEY=shared_supabase_key
# Add other required environment variables
```

**Important:** All team members use the same shared Supabase credentials. Contact the project lead to get the shared credentials - do not create your own Supabase project.

## API Endpoints

- `GET /properties` - Get all properties
- `POST /properties` - Create new property
- `GET /properties/{id}` - Get property by ID
- `PUT /properties/{id}` - Update property
- `DELETE /properties/{id}` - Delete property
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team Members

- [Your Name] - Project Lead
- [Teammate 1] - Backend Developer
- [Teammate 2] - Frontend Developer
- [Teammate 3] - Full-stack Developer

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Backend: Change port in `uvicorn main:app --reload --port 8001`
   - Frontend: Vite will automatically suggest an alternative port

2. **Database connection issues:**
   - Verify your Supabase credentials in the `.env` file
   - Check if your Supabase project is active

3. **Module not found errors:**
   - Make sure you've activated your virtual environment
   - Run `pip install -r requirements.txt` again

4. **Frontend build errors:**
   - Delete `node_modules` and run `npm install` again
   - Check if all dependencies are installed correctly

## Support

If you encounter any issues, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about the problem
