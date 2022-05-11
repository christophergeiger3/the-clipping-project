# To run:

First start mongodb:
```
sudo systemctl start mongodb.service
```

then launch the back-end:
```
cd api
npm install
npm run start
```

finally launch the front-end:
```
cd web
yarn
yarn start
```
