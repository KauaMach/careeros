import pytest
from unittest.mock import patch, MagicMock
from app.core.ai import enhance_resume_text

@pytest.mark.asyncio
async def test_enhance_resume_text_fallback():
    # Setup - pretend no API key or exception occurs to hit the fallback
    with patch("app.core.ai.get_gemini_client", return_value=None):
        text = "Meu curriculo"
        result = await enhance_resume_text(text)
        
        # Assert
        assert "✨ [Versão Melhorada pela IA]" in result
        assert "Meu curriculo" in result

@pytest.mark.asyncio
async def test_enhance_resume_text_success():
    # Mocking genai client
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Curriculo melhorado pela IA"
    mock_client.models.generate_content.return_value = mock_response
    
    with patch("app.core.ai.get_gemini_client", return_value=mock_client):
        result = await enhance_resume_text("Meu curriculo")
        
        assert result == "Curriculo melhorado pela IA"
        mock_client.models.generate_content.assert_called_once()
