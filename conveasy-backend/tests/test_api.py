"""
Testes para o backend Conveasy
Testes simplificados usando apenas FastAPI TestClient
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Mock do Supabase para evitar conexões reais
with patch('app.database.supabase_client.get_supabase') as mock_supabase:
    mock_client = MagicMock()
    mock_supabase.return_value = mock_client
    from app.main import app

# Cliente de teste
client = TestClient(app)


class TestHealthCheck:
    """Testes básicos de saúde da API"""

    def test_root_endpoint(self):
        """Testa se a API está respondendo"""
        response = client.get("/")
        assert response.status_code in [200, 404]  # Pode não ter endpoint root

    def test_docs_endpoint(self):
        """Testa se a documentação está acessível"""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_openapi_endpoint(self):
        """Testa se o OpenAPI JSON está disponível"""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert "paths" in data


class TestAuth:
    """Testes de autenticação"""

    @patch('app.database.supabase_client.get_supabase')
    def test_login_endpoint_exists(self, mock_supabase):
        """Testa se o endpoint de login existe"""
        # Mock da resposta do Supabase
        mock_client = MagicMock()
        mock_supabase.return_value = mock_client

        # Simula resposta de login
        mock_response = MagicMock()
        mock_response.data = [{"id": "1", "email": "test@test.com"}]
        mock_client.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value = mock_response

        response = client.post("/api/v1/usuarios/login", json={"email": "test@test.com", "senha": "123"})
        # Deve retornar erro de validação ou autenticação, mas não 404
        assert response.status_code != 404

    def test_protected_endpoints_require_auth(self):
        """Testa se endpoints protegidos requerem autenticação"""
        endpoints = [
            "/api/v1/usuarios/",
            "/api/v1/empresas/",
            "/api/v1/convenios/",
            "/api/v1/alertas/"
        ]

        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code in [401, 403]  # Não autorizado ou proibido


class TestValidators:
    """Testes de validações"""

    def test_cnpj_validation(self):
        """Testa validação de CNPJ"""
        from app.utils.validators import validate_cnpj, format_cnpj

        # CNPJ válido
        assert validate_cnpj("11.222.333/0001-81") == True
        assert validate_cnpj("11222333000181") == True

        # CNPJ inválido
        assert validate_cnpj("00.000.000/0000-00") == False
        assert validate_cnpj("11111111111111") == False

        # Formatação
        formatted = format_cnpj("11222333000181")
        assert formatted == "11.222.333/0001-81"

    def test_cpf_validation(self):
        """Testa validação de CPF"""
        from app.utils.validators import validate_cpf, format_cpf

        # CPF válido (exemplo)
        assert validate_cpf("123.456.789-09") == True
        assert validate_cpf("12345678909") == True

        # CPF inválido
        assert validate_cpf("00000000000") == False
        assert validate_cpf("11111111111") == False

    def test_file_validation(self):
        """Testa validações de arquivo"""
        from app.utils.validators import validate_file_size, validate_file_type, sanitize_filename

        # Tamanho de arquivo
        assert validate_file_size(1024 * 1024) == True  # 1MB
        assert validate_file_size(20 * 1024 * 1024) == False  # 20MB

        # Tipo de arquivo
        assert validate_file_type("documento.pdf", ['pdf', 'doc']) == True
        assert validate_file_type("arquivo.exe", ['pdf', 'doc']) == False

        # Sanitização de nome - corrigido para manter acentos
        clean_name = sanitize_filename("documento (cópia).pdf")
        assert clean_name == "documento_cópia.pdf"


class TestSchemas:
    """Testes de schemas Pydantic"""

    def test_convenio_schema(self):
        """Testa schema de convênio"""
        from app.schemas.convenio import ConvenioCreate

        # Dados válidos com todos os campos obrigatórios
        data = {
            "numero_convenio": "CONV-001",
            "empresa_id": "empresa-123",
            "descricao": "Descrição do convênio",
            "data_inicio": "2024-01-01",
            "data_fim": "2024-12-31",
            "status": "ativo",
            "escopo": "Escopo do convênio",
            "responsavel_id": "user-123"
        }

        convenio = ConvenioCreate(**data)
        assert convenio.numero_convenio == "CONV-001"
        assert convenio.empresa_id == "empresa-123"

    def test_empresa_schema(self):
        """Testa schema de empresa"""
        from app.schemas.empresa import EmpresaCreate

        data = {
            "razao_social": "Empresa Teste Ltda",
            "cnpj": "11.222.333/0001-81",
            "endereco": "Rua Teste, 123",
            "cidade": "São Paulo",
            "estado": "SP",
            "cep": "01234-567",
            "email": "contato@empresa.com",
            "representante_legal": "João Silva",
            "cargo_representante": "Diretor"
        }

        empresa = EmpresaCreate(**data)
        assert empresa.razao_social == "Empresa Teste Ltda"
        assert empresa.cnpj == "11.222.333/0001-81"


if __name__ == "__main__":
    pytest.main([__file__])