FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# copy and publish app and libraries
COPY . .
RUN dotnet publish -c release -o /app --no-restore

# generate dev certificate to handle https
RUN dotnet dev-certs https

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app .
CMD ConnectionStrings__SessionContext=$ConnectionStrings__SessionContext AllowedOrigin=$AllowedOrigin dotnet server.dll --urls http://*:$PORT
