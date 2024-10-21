# ใช้ภาพพื้นฐานจาก Node.js
FROM node:16 AS build

# ตั้งค่าการทำงาน
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์อื่น ๆ และสร้างแอปพลิเคชัน
COPY . .
RUN npm run build

# ใช้ Nginx เป็น web server
FROM nginx:alpine

# คัดลอกไฟล์ build ไปยังตำแหน่งที่ Nginx ให้บริการ
COPY --from=build /app/build /usr/share/nginx/html

# คัดลอกการตั้งค่า Nginx ที่กำหนดเอง
COPY nginx.conf /etc/nginx/nginx.conf

# เปิดพอร์ต 80
EXPOSE 80

# คำสั่งเริ่มต้นสำหรับ container
CMD ["nginx", "-g", "daemon off;"]
