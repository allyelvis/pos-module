#!/bin/bash

# Exit on error
set -e

# Update system
echo "Updating system..."
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
echo "Installing dependencies..."
sudo apt-get install -y python3 python3-pip nodejs npm

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt-get install -y postgresql postgresql-contrib

# Create database and user
echo "Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE pos_db;"
sudo -u postgres psql -c "CREATE USER pos_user WITH PASSWORD 'password';"
sudo -u postgres psql -c "ALTER ROLE pos_user SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE pos_user SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE pos_user SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pos_db TO pos_user;"

# Clone the repository
echo "Cloning the repository..."
git clone https://github.com/your-repo/pos-system.git
cd pos-system

# Set up Python virtual environment
echo "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Set up Django
echo "Setting up Django..."
python manage.py migrate
python manage.py createsuperuser

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build the frontend
echo "Building the frontend..."
npm run build

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Set up Gunicorn
echo "Setting up Gunicorn..."
sudo pip install gunicorn
sudo nano /etc/systemd/system/gunicorn.service

# Add the following content to the file:
# [Unit]
# Description=gunicorn daemon
# After=network.target
#
# [Service]
# User=ubuntu
# Group=www-data
# WorkingDirectory=/home/ubuntu/pos-system
# ExecStart=/home/ubuntu/pos-system/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/ubuntu/pos-system/pos.sock pos.wsgi:application
#
# [Install]
# WantedBy=multi-user.target

# Start and enable Gunicorn
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Set up Nginx
echo "Setting up Nginx..."
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/pos

# Add the following content to the file:
# server {
#     listen 80;
#     server_name your_domain.com;
#
#     location = /favicon.ico { access_log off; log_not_found off; }
#     location /static/ {
#         root /home/ubuntu/pos-system;
#     }
#
#     location / {
#         include proxy_params;
#         proxy_pass http://unix:/home/ubuntu/pos-system/pos.sock;
#     }
# }

# Enable the Nginx configuration
sudo ln -s /etc/nginx/sites-available/pos /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Let's Encrypt
echo "Setting up SSL..."
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com

# Final steps
echo "Finalizing setup..."
sudo systemctl restart gunicorn
sudo systemctl restart nginx

echo "POS system setup complete!"

# Schedule automatic updates and backups
echo "Setting up automatic updates and backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/bin/apt-get update && /usr/bin/apt-get upgrade -y") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * * pg_dump pos_db > /home/ubuntu/backups/pos_db_$(date +\%Y\%m\%d).sql") | crontab -

# Set up log rotation
echo "Setting up log rotation..."
sudo nano /etc/logrotate.d/pos
# Add the following content to the file:
# /home/ubuntu/pos-system/logs/*.log {
#     weekly
#     missingok
#     rotate 52
#     compress
#     delaycompress
#     notifempty
#     create 0640 ubuntu www-data
# }

echo "Setup complete! Your POS system is now running and configured for automatic updates and backups."

