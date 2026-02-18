
# न्यायSAATHI (NyayaSAATHI) - Engineering Blueprint

## 1. Product Architecture
### C4 Component Logic
- **Person**: Indian Citizen (Zero legal knowledge).
- **Software System**: न्यायSAATHI Web Platform.
- **Containers**:
  - **Single Page Application**: React + Tailwind.
  - **Backend API**: NestJS (Modular Design).
  - **Database**: PostgreSQL (Structured Legal Records).
  - **AI Engine**: Google Gemini 2.5/3 Flash.
  - **Storage**: AWS S3 (Unstructured Legal PDFs).

## 2. System Design & AI Orchestration
### RAG Strategy
- **Ingestion**: Indian Law PDFs (IPC/BNS) are chunked and embedded using text-embedding-004.
- **Retrieval**: User queries are vector-searched against PGVector store.
- **Generation**: Gemini Flash synthesizes the retrieved chunks into a simple explanation.

### Service Layer Pattern
- Abstract `LegalAnalysisService` interface.
- Concrete `GeminiLegalProvider` implementation.
- Ensures the model can be swapped (e.g., from Flash to Pro) without touching business logic.

## 3. Key Workflows
### Document Analysis Flow
1. **Frontend**: User uploads PDF/Text.
2. **Backend**: Text extraction via `pdf-parse`.
3. **AI Task**: `gemini-3-flash-preview` parses text into a JSON Risk Map.
4. **Processing**: System checks for specific IPC vs BNS mapping.
5. **Output**: UI renders the "RiskBadge" and "Simplified Clauses".

## 4. API Specification
- `POST /api/analyze`: Multipart/form-data. Returns `AnalysisResult`.
- `GET /api/search?q=query`: Returns `LawDirectory[]`.
- `POST /api/quiz/generate`: Generates context-aware questions based on recent analysis.

## 5. Deployment & Security
### Environment Variables
- `API_KEY`: Google Gemini API Key.
- `DATABASE_URL`: PostgreSQL connection string.
- `S3_ENDPOINT`: For legal document storage.

### Security Measures
- **Rate Limiting**: Prevent abuse of AI endpoints.
- **PDF Sanitization**: Strip malicious scripts from uploaded docs.
- **PII Masking**: Ensure personal data is not sent to the LLM (where applicable).
