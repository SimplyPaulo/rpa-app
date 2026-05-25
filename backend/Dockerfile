# ══════════════════════════════════════════════════════════
#  RPA Backend — Multi-stage Docker build
#  Stage 1: Build the .NET app
#  Stage 2: Run it in a lightweight runtime image
# ══════════════════════════════════════════════════════════

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY RPA.API/RPA.API.csproj ./RPA.API/
RUN dotnet restore ./RPA.API/RPA.API.csproj

# Copy source code and publish
COPY RPA.API/ ./RPA.API/
RUN dotnet publish ./RPA.API/RPA.API.csproj -c Release -o /app/publish

# ── Runtime Stage ─────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Render sets the PORT env variable
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:${PORT:-10000}

EXPOSE 10000

ENTRYPOINT ["dotnet", "RPA.API.dll"]
