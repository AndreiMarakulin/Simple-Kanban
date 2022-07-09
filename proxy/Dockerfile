FROM andreimarakulin/kanban-frontend:latest as builder
FROM nginx:alpine
COPY --from=builder /usr/src/app/build /var/www/public
COPY ./nginx /etc/nginx