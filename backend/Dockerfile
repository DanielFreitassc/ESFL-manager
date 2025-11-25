# Etapa 1: Build com Maven
FROM maven:4.0.0-rc-5-amazoncorretto-25-al2023 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Execução com OpenJDK 21
FROM azul/zulu-openjdk-alpine:21
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar  
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 