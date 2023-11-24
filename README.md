# 409 Group Project - MCS degree tracker
# Students are able to track the progress of their MCS degree with motivation being making tracking degree easier.

## . Getting Started
1. Clone the repository:
`git clone https://gitlab.com/uiuc-web-programming/mp3.git mp3`, then `cd mp3`
2. Install dependencies:
`npm install`
3. Start the dev server:
`npm start` or 
`nodemon --exec node server.js` to automatically restart the server on save.


# Mongo Collections
# users:
    - id, name, role details
    - used for login screen
# students:
    - student details
    - courses completed, enrolled.
    - grades etc.
# majors:
    - details of mcs requirements.
    - multiple documents possible to phase out based on academic year.
# courses:
    - course details, dependencies.

# API details
