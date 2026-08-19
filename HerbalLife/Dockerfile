FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8082

CMD ["sh", "-c", "java -jar target/MyProject-0.0.1-SNAPSHOT.jar"]