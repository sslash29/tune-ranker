FROM python:3.8.20-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy backend files
COPY . .

# Create certificates directory
RUN mkdir -p /app/certificates

# Expose the backend port
EXPOSE 5000

# Run the Flask app with HTTPS
CMD ["python", "app.py"]