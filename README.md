# 🛒 StoreApp
The **StoreApp** is a small personal project based on an e-commerce, designed to help me learn some technologies.

## 🌐 Access Application
You can access the application hosted on Render at the following link: [https://storeapp-klm0.onrender.com](https://storeapp-klm0.onrender.com)

## 🛠️ Technologies and Tools
- 💻**Back-end**: Node.js, Express
- 🎨**Front-end**: Tailwind
- 🗄️**Database**: MySQL, Sequelize
- ✅**E2E Tests**: Cypress
- 🔒**Security**: Passport, Helmet, bcrypt, dotenv, express-validator, jsonwebtoken, csurf
- ⚡**CI/CD**: Pipeline implementation for automated integration and E2E tests with GitHub Actions
- 🐳 **DevOps/Containerization**: Docker

## 📚 Learnings
###### During the development of this project, I acquired knowledge in:
1. Version control practices with Git.
2. E2E tests with Cypress
3. CI/CD with automated integration and E2E tests.
4. MySQL by creating databases and tables
5. English in development enviroment
6. Tailwind to create visual elements
7. Practiced screen resizing
8. Secure authentication with Passport (Google & Facebook strategy).
9. Secure authentication with JWT (Local Strategy)
10. Project Containerization with Docker
11. Best security practices, such as sanitization, XSS prevention (Helmet), and data validation.
12. Maked the visual content with Handlebars
13. Learning MVC best practices to improve project structure

## ⚙️ Installation

### 🐳 Method 1: Installation via Docker
1)  **Install Docker and Docker Compose:**
   - Ensure you have Docker and Docker Compose installed on your system. You can find installation instructions for your operating system on the official Docker website.

2)  **Pull Comand**
   - `docker pull reapersz/storeapp`

### 💾 Method 2: Installation via Git and npm (Manual Setup)
1) Clone the repository:
   - `git clone [REPOSITORY_URL]`
2) Navigate to the project directory:
   - `cd Storeapp`
3) Install the dependencies:
   - `npm install`
4) View ao enviroment variables
   - You can visualize all envs in: `./.env,example`
5) Configure the MySQL database:
   1 Create a storeapp database in MySQL.
   2 Navigate to this directory: `./sql/schema.sql`
   3 Create a table users founded in schema.sql
   4 Adjust the connection settings in the `./src/database/connection.js` file.
6) Start the server:
   - `npm run start
