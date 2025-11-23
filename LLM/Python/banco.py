from db import get_connection

def show_table_columns(table):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(f"""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '{table}'
        ORDER BY ordinal_position;
    """)

    print(f"\nTabela: {table}")
    for col in cur.fetchall():
        print("  -", col[0], "=>", col[1])

    cur.close()
    conn.close()

tables = ["parcels", "transactions", "suppliers", "cost_centers"]
for t in tables:
    show_table_columns(t)
