FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

RUN dotnet dev-certs https

# copy and publish app and libraries
COPY . .
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app .
CMD ConnectionStrings__SessionContext=$ConnectionStrings__SessionContext AllowedOrigin=$AllowedOrigin dotnet server.dll --urls https://*:$PORT
