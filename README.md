#  Event Management API

A Node.js + Express backend API using Sequelize ORM and Supabase PostgreSQL to  event creation, registration, and reporting.

---

## Tech Stack
- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL (via Supabase)
- REST APIs

---

##  Setup Instructions


git clone https://github.com/Chandu5342/EventManagementApis.git
cd event-management-api
npm install
```


###  Start the Server
node index.js


## 🛠️ API Endpoints

| Method | Route                      | Description                          |
|--------|----------------------------|--------------------------------------|
| POST   | /api/events                | Create a new event                   |
| GET    | /api/events/:id            | Get event details                    |
| POST   | /api/uregister             | Register a user for an event         |
| DELETE | /api/Udelete               | Cancel user's registration           |
| GET    | /api/Upcomingevents        | List all upcoming events             |
| GET    | /api/eventstats/:id        | Get stats for a specific event       |

---

##  Folder Structure

```
.
├── config/            
├── controllers/      
├── models/         
├── routes/          
├── index.js          
└── .env               
```

---

##  Sample Request

### Register for Event

```http
POST /api/register
Content-Type: application/json

{
  "userid": 1,
  "username": "Chandu",
  "eventid": 2
}
```

---

## 🔗 Submission Info

-  Candidate: Chandu Karri
-  Date: 16 July 2025
-  GitHub Repo: [https://github.com/Chandu5342/EventManagementApis.git]
-  Google Drive: https://drive.google.com/file/d/1avu3boFSCkL9MAMDYhwa0IUpPs-gMP1F/view?usp=sharing

---

## 📝 Notes

- Live DB hosted on Supabase PostgreSQL
- All validations (capacity, duplicate, expired) handled
- Relations set with Sequelize (User ↔️ Event)

---

Made with  by Chandu
