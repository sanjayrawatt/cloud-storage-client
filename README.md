# CloudStore - Secure File Storage Application

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to upload, download, and manage files with end-to-end encryption. All files are encrypted on the client-side before being uploaded, ensuring complete privacy.

**[➡️ Live Demo](https://my-secure-cloud-storage.netlify.app/)**

---

### Key Features

-   **User Authentication**: Secure user registration and login (JWT).
-   **End-to-End Encryption**: Files are encrypted in the browser using CryptoJS (AES) before upload.
-   **Secure File Management**: Upload, download, rename, and delete encrypted files.
-   **Master Encryption Key**: Users set a master key that is never stored on the server, ensuring only they can decrypt their files.
-   **Cloud Storage**: Integrated with a cloud provider for scalable file storage.
-   **Responsive Design**: A modern and clean user interface built with React and Tailwind CSS.

### Tech Stack

-   **Frontend**: React, React Router, Axios, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (with Mongoose)
-   **Authentication**: JSON Web Tokens (JWT), bcrypt
-   **Encryption**: CryptoJS (AES)
-   **Deployment**:
    -   Frontend deployed on **Netlify**.
    -   Backend deployed on **Render**.

### View Backend Repository

The backend code for the API and server logic can be found here:

**➡️ [Backend GitHub Repository](https://github.com/sanjayrawatt/cloud-storage-system)**  

---
