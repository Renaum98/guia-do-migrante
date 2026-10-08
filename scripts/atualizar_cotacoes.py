import datetime
import json
import pathlib
import urllib.error
import urllib.request

MOEDAS = [
    "USD", "EUR", "VES", "HTG", "BOB", "COP", "PEN", "PYG", "ARS", "UYU", "CLP", "CUP",
    "CNY", "AOA", "CDF", "NGN", "XOF", "XAF", "AFN", "SYP", "UAH", "LBP", "BDT", "GBP",
]
URL = "https://www4.bcb.gov.br/Download/fechamento/{:%Y%m%d}.csv"
DESTINO = pathlib.Path(__file__).resolve().parent.parent / "data" / "cotacoes.json"


def baixar():
    hoje = datetime.date.today()
    for dias in range(0, 10):
        dia = hoje - datetime.timedelta(days=dias)
        url = URL.format(dia)
        pedido = urllib.request.Request(url, headers={"User-Agent": "guia-do-migrante/1.0"})
        try:
            with urllib.request.urlopen(pedido, timeout=30) as resposta:
                texto = resposta.read().decode("latin-1")
        except urllib.error.URLError:
            continue
        if ";" in texto:
            return url, texto
    raise SystemExit("Nenhum arquivo de fechamento encontrado nos últimos 10 dias.")


def numero(valor):
    return float(valor.replace(".", "").replace(",", "."))


def main():
    url, texto = baixar()
    taxas = {}
    data = None
    for linha in texto.splitlines():
        partes = linha.strip().split(";")
        if len(partes) < 6 or partes[3] not in MOEDAS:
            continue
        data = datetime.datetime.strptime(partes[0], "%d/%m/%Y").date()
        taxas[partes[3]] = (numero(partes[4]) + numero(partes[5])) / 2
    if not taxas:
        raise SystemExit("Arquivo sem as moedas esperadas.")
    resultado = {
        "data": data.isoformat(),
        "fonte": "Banco Central do Brasil",
        "url": url,
        "moedas": {codigo: round(taxas[codigo], 8) for codigo in MOEDAS if codigo in taxas},
    }
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(resultado['moedas'])} moedas, cotação de {resultado['data']}")


if __name__ == "__main__":
    main()
