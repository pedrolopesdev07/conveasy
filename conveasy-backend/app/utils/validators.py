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
