"""
Validadores Customizados
Implementa regras de negócio específicas do sistema ConvEasy
"""

import re
from typing import Optional


def validate_cnpj(cnpj: str) -> bool:
    """
    Valida um CNPJ segundo as regras do módulo 11 (RN06)
    Implementa a validação de Razão Social única por CNPJ

    Args:
        cnpj: String contendo o CNPJ com ou sem formatação

    Returns:
        bool: True se CNPJ é válido, False caso contrário

    Raises:
        ValueError: Se o formato do CNPJ for inválido

    Exemplo:
        ```python
        if validate_cnpj("11.222.333/0001-81"):
            print("CNPJ válido")
        ```

    Nota:
        CNPJ aceito com formatos:
        - Com pontuação: "11.222.333/0001-81"
        - Sem pontuação: "11222333000181"
    """
    # Remove caracteres especiais
    cnpj_clean = re.sub(r'\D', '', cnpj)

    # Verifica se tem 14 dígitos
    if len(cnpj_clean) != 14:
        raise ValueError("CNPJ deve conter 14 dígitos")

    # Verifica se não é sequência repetida (ex: 11111111111111)
    if len(set(cnpj_clean)) == 1:
        return False

    # Cálculo do primeiro dígito verificador
    first_check = _calculate_cnpj_first_digit(cnpj_clean)

    # Cálculo do segundo dígito verificador
    second_check = _calculate_cnpj_second_digit(cnpj_clean)

    # Compara com os dígitos verificadores fornecidos
    return (
        cnpj_clean[12] == str(first_check) and
        cnpj_clean[13] == str(second_check)
    )


def _calculate_cnpj_first_digit(cnpj: str) -> int:
    """
    Calcula o primeiro dígito verificador do CNPJ

    Args:
        cnpj: CNPJ sem caracteres especiais

    Returns:
        int: Primeiro dígito verificador
    """
    sequence = "5432987654321"
    sum_result = sum(int(cnpj[i]) * int(sequence[i]) for i in range(12))
    remainder = sum_result % 11

    return 0 if remainder < 2 else 11 - remainder


def _calculate_cnpj_second_digit(cnpj: str) -> int:
    """
    Calcula o segundo dígito verificador do CNPJ

    Args:
        cnpj: CNPJ sem caracteres especiais

    Returns:
        int: Segundo dígito verificador
    """
    sequence = "6543298765432"
    sum_result = sum(int(cnpj[i]) * int(sequence[i]) for i in range(13))
    remainder = sum_result % 11

    return 0 if remainder < 2 else 11 - remainder


def format_cnpj(cnpj: str) -> str:
    """
    Formata um CNPJ para o padrão XX.XXX.XXX/XXXX-XX

    Args:
        cnpj: CNPJ sem formatação (14 dígitos)

    Returns:
        str: CNPJ formatado

    Raises:
        ValueError: Se o CNPJ não tiver 14 dígitos

    Exemplo:
        ```python
        formatted = format_cnpj("11222333000181")
        # Resultado: "11.222.333/0001-81"
        ```
    """
    cnpj_clean = re.sub(r'\D', '', cnpj)

    if len(cnpj_clean) != 14:
        raise ValueError("CNPJ deve conter 14 dígitos para formatação")

    return f"{cnpj_clean[0:2]}.{cnpj_clean[2:5]}.{cnpj_clean[5:8]}/{cnpj_clean[8:12]}-{cnpj_clean[12:14]}"


def validate_email(email: str) -> bool:
    """
    Valida formato de email

    Args:
        email: String com endereço de email

    Returns:
        bool: True se email tem formato válido

    Exemplo:
        ```python
        if validate_email("user@example.com"):
            print("Email válido")
        ```
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """
    Valida formato de telefone brasileiro

    Args:
        phone: String com número telefônico

    Returns:
        bool: True se telefone tem formato válido

    Exemplo:
        ```python
        if validate_phone("(65) 99999-9999"):
            print("Telefone válido")
        ```

    Nota:
        Aceita formatos:
        - Com formatação: "(65) 99999-9999"
        - Sem formatação: "6599999999"
    """
    phone_clean = re.sub(r'\D', '', phone)
    # Telefone brasileiro tem 10 ou 11 dígitos
    return len(phone_clean) in [10, 11]


def validate_date_range(start_date: str, end_date: str) -> bool:
    """
    Valida que a data inicial é anterior à data final

    Args:
        start_date: Data inicial no formato YYYY-MM-DD
        end_date: Data final no formato YYYY-MM-DD

    Returns:
        bool: True se o intervalo é válido

    Raises:
        ValueError: Se o formato das datas for inválido
    """
    from datetime import datetime

    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        return start < end
    except ValueError as e:
        raise ValueError(f"Formato de data inválido: {str(e)}")


def validate_cpf(cpf: str) -> bool:
    """
    Valida um CPF segundo as regras do módulo 11

    Args:
        cpf: String contendo o CPF com ou sem formatação

    Returns:
        bool: True se CPF é válido, False caso contrário

    Raises:
        ValueError: Se o formato do CPF for inválido

    Exemplo:
        ```python
        if validate_cpf("123.456.789-09"):
            print("CPF válido")
        ```
    """
    # Remove caracteres especiais
    cpf_clean = re.sub(r'\D', '', cpf)

    # Verifica se tem 11 dígitos
    if len(cpf_clean) != 11:
        raise ValueError("CPF deve conter 11 dígitos")

    # Verifica se não é sequência repetida
    if len(set(cpf_clean)) == 1:
        return False

    # Cálculo do primeiro dígito verificador
    first_check = _calculate_cpf_first_digit(cpf_clean)

    # Cálculo do segundo dígito verificador
    second_check = _calculate_cpf_second_digit(cpf_clean)

    # Compara com os dígitos verificadores fornecidos
    return (
        cpf_clean[9] == str(first_check) and
        cpf_clean[10] == str(second_check)
    )


def _calculate_cpf_first_digit(cpf: str) -> int:
    """
    Calcula o primeiro dígito verificador do CPF

    Args:
        cpf: CPF sem caracteres especiais

    Returns:
        int: Primeiro dígito verificador
    """
    sum_result = sum(int(cpf[i]) * (10 - i) for i in range(9))
    remainder = sum_result % 11

    return 0 if remainder < 2 else 11 - remainder


def _calculate_cpf_second_digit(cpf: str) -> int:
    """
    Calcula o segundo dígito verificador do CPF

    Args:
        cpf: CPF sem caracteres especiais

    Returns:
        int: Segundo dígito verificador
    """
    sum_result = sum(int(cpf[i]) * (11 - i) for i in range(10))
    remainder = sum_result % 11

    return 0 if remainder < 2 else 11 - remainder


def format_cpf(cpf: str) -> str:
    """
    Formata um CPF para o padrão XXX.XXX.XXX-XX

    Args:
        cpf: CPF sem formatação (11 dígitos)

    Returns:
        str: CPF formatado

    Raises:
        ValueError: Se o CPF não tiver 11 dígitos
    """
    cpf_clean = re.sub(r'\D', '', cpf)

    if len(cpf_clean) != 11:
        raise ValueError("CPF deve conter 11 dígitos para formatação")

    return f"{cpf_clean[0:3]}.{cpf_clean[3:6]}.{cpf_clean[6:9]}-{cpf_clean[9:11]}"


def validate_file_size(file_size: int, max_size_mb: int = 10) -> bool:
    """
    Valida se o tamanho do arquivo está dentro do limite

    Args:
        file_size: Tamanho do arquivo em bytes
        max_size_mb: Tamanho máximo em MB (padrão: 10MB)

    Returns:
        bool: True se tamanho é válido

    Exemplo:
        ```python
        if validate_file_size(5242880):  # 5MB
            print("Arquivo válido")
        ```
    """
    max_size_bytes = max_size_mb * 1024 * 1024
    return file_size <= max_size_bytes


def validate_file_type(filename: str, allowed_types: list[str]) -> bool:
    """
    Valida se o tipo do arquivo é permitido

    Args:
        filename: Nome do arquivo
        allowed_types: Lista de extensões permitidas (ex: ['pdf', 'doc', 'docx'])

    Returns:
        bool: True se tipo é permitido

    Exemplo:
        ```python
        if validate_file_type("documento.pdf", ['pdf', 'docx']):
            print("Tipo de arquivo válido")
        ```
    """
    if not filename or '.' not in filename:
        return False

    extension = filename.split('.')[-1].lower()
    return extension in [t.lower() for t in allowed_types]


def sanitize_filename(filename: str) -> str:
    """
    Remove caracteres especiais e espaços do nome do arquivo

    Args:
        filename: Nome original do arquivo

    Returns:
        str: Nome sanitizado

    Exemplo:
        ```python
        clean_name = sanitize_filename("documento (cópia).pdf")
        # Resultado: "documento_copia.pdf"
        ```
    """
    # Remove caracteres especiais e substitui espaços por underscore
    sanitized = re.sub(r'[^\w\s.-]', '', filename)
    sanitized = re.sub(r'\s+', '_', sanitized)
    return sanitized
