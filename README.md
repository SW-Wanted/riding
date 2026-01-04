# Transporte Universitário Angola

Sistema de gestão de transporte para estudantes universitários em Luanda, Angola.

## Descrição

Este aplicativo conecta estudantes das universidades ISPTEC e Oscar Ribas com serviços de transporte confiável, facilitando as deslocações diárias entre casa e a universidade.

## Características Principais

### Para Estudantes
- Registo com email institucional
- Visualização de horários disponíveis
- Reserva de viagens (ida e volta)
- Gestão de reservas
- Informação de pagamento (diário, semanal, mensal)
- Acompanhamento do estado de pagamento

### Para Motoristas
- Visualização de viagens atribuídas
- Check-in de estudantes
- Gestão de passageiros por turno
- Visualização de rotas e horários

### Para Administradores
- Painel de controle completo
- Gestão de estudantes, motoristas e veículos
- Criação e gestão de horários
- Visualização de estatísticas
- Gestão de rotas

## Universidades Suportadas

- **ISPTEC** - Instituto Superior Politécnico de Tecnologias e Ciências
  - Email: `[numero_estudante]@isptec.co.ao`
  - Exemplo: `20230429@isptec.co.ao`

- **Oscar Ribas**
  - Email: `[numero_estudante]@oscarribas.co.ao`

## Rotas Disponíveis

1. Viana
2. Golf 2
3. Shoprite Palanca
4. Desvio do Zango
5. Camama 1
6. Rotunda do Camama
7. Talatona (Universidades) - Destino final

## Turnos

### Manhã
- **Ida**: 6:30h - 8:00h
- **Volta**: 12:00h

### Tarde
- **Ida**: 12:30h - 14:00h
- **Volta**: 17:00h

### Noite
- **Volta**: 21:00h

## Dias de Operação

Segunda-feira a Sexta-feira

## Preços

- **Diário**: 1.500 Kz por viagem
- **Semanal**: 7.000 Kz (5 dias úteis)
- **Mensal**: 25.000 Kz (20 dias úteis)

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase
- **Database**: PostgreSQL (Supabase)
- **Autenticação**: Supabase Auth

## Estrutura da Base de Dados

### Tabelas Principais

- `users` - Utilizadores (estudantes, motoristas, administradores)
- `universities` - Universidades
- `routes` - Rotas de transporte
- `schedules` - Horários de viagens
- `vehicles` - Veículos
- `bookings` - Reservas de estudantes
- `payments` - Pagamentos

## Níveis de Acesso

1. **Estudante** - Pode fazer e gerir reservas
2. **Motorista** - Pode ver passageiros e fazer check-in
3. **Administrador** - Acesso completo ao sistema

## Segurança

- Autenticação obrigatória com email institucional
- Row Level Security (RLS) em todas as tabelas
- Políticas de acesso baseadas em papéis
- Proteção de dados pessoais dos estudantes

## Instalação e Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente no arquivo `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Execute as migrações da base de dados
5. Inicie o servidor de desenvolvimento: `npm run dev`

## Build para Produção

```bash
npm run build
```

## Contacto

Para mais informações sobre o serviço de transporte universitário, contacte a administração da sua universidade.

---

Desenvolvido para ajudar estudantes angolanos a ter acesso a transporte seguro e confiável.
