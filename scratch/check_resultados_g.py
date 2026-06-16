import openpyxl

wb = openpyxl.load_workbook('Marcadores Mundial 2026.xlsx', data_only=False)
sheet = wb['Resultados']
print("Resultados column G formulas:")
for r in range(1, 10):
    val = sheet.cell(r, 7).value
    print(f"Row {r}: {val}")
