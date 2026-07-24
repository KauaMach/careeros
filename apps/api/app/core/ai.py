from app.core.config import settings
from google import genai
from google.genai import types

def get_gemini_client():
    if not settings.GEMINI_API_KEY:
        return None
    return genai.Client(api_key=settings.GEMINI_API_KEY)

async def enhance_resume_text(text: str, role: str | None = None, company: str | None = None) -> str:
    client = get_gemini_client()
    
    prompt = f"""Você é um especialista em recrutamento e seleção (Tech Recruiter Senior).
Sua tarefa é reescrever a descrição de uma experiência profissional em um currículo para que fique mais atraente, utilizando verbos de ação fortes, focando em resultados e impacto (preferencialmente método STAR), e mantendo a linguagem profissional em português.

Contexto da Experiência:
Cargo: {role or 'Não especificado'}
Empresa: {company or 'Não especificada'}

Texto Original:
{text}

Reescreva o texto original para que fique mais profissional. Retorne APENAS o texto melhorado, sem introduções ou explicações.
"""

    if client:
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                )
            )
            return response.text.strip()
        except Exception as e:
            print(f"Erro ao chamar Gemini API: {e}")
            # Fallback for errors
            pass
            
    # Fallback if no API key or error
    return f"✨ [Versão Melhorada pela IA]\n{text}\n\n(Dica: Para resultados reais, configure a variável GEMINI_API_KEY no arquivo .env do backend)"
