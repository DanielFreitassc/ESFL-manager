FROM python:3.12-slim

# Evita criação de .pyc e melhora logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências do sistema (necessário para psycopg2)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean

# Copia requirements primeiro para cache eficiente
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do projeto
COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
