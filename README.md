<p align="center">
  <img src="https://openclipart.org/image/800px/249421" width="120" alt="TCP Logo" />
</p>
<p align="center">An easy to use web based clipping tool; TCP generates and hosts shareable video clips. </p>

## Getting Started

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
