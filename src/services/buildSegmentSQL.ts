export interface FilterRow {
  field: string;
  condition: string;
  value: string;
}

export function buildSegmentSQL(filters: FilterRow[]) {

  const whereConditions: string[] = [];
  const havingConditions: string[] = [];

  filters.forEach((filter) => {

    switch (filter.field) {

      case "city": {

        const cities = filter.value
          .split(",")
          .map((c: string) => c.trim().toUpperCase().replace(/'/g, "''"));

        if (filter.condition === "eq") {

          const conditions = cities.map(
            (city: string) => `UPPER(c.CIDADE) LIKE '%${city}%'`
          );

          whereConditions.push(`(${conditions.join(" OR ")})`);
        }

        if (filter.condition === "neq") {

          const conditions = cities.map(
            (city: string) => `UPPER(c.CIDADE) LIKE '%${city}%'`
          );

          whereConditions.push(`NOT (${conditions.join(" OR ")})`);
        }

        break;
      }


      case "last_purchase": {

        const days = Number(filter.value);
        if (!Number.isFinite(days)) return;

        if (filter.condition === "gt")
          havingConditions.push(
            `MAX(p.DATA_PEDIDO) <= DATEADD(-${days} DAY TO CURRENT_DATE)`
          );

        if (filter.condition === "lt")
          havingConditions.push(
            `MAX(p.DATA_PEDIDO) >= DATEADD(-${days} DAY TO CURRENT_DATE)`
          );

        if (filter.condition === "eq") {
          havingConditions.push(
            `MAX(p.DATA_PEDIDO) = DATEADD(-${days} DAY TO CURRENT_DATE)`
          );
        }

        break;
      }

      case "total_purchases": {

        const num = Number(filter.value);
        if (!Number.isFinite(num)) return;

        if (filter.condition === "gt")
          havingConditions.push(`COUNT(p.CODIGO_PEDIDO) > ${num}`);

        if (filter.condition === "lt")
          havingConditions.push(`COUNT(p.CODIGO_PEDIDO) < ${num}`);

        if (filter.condition === "eq")
          havingConditions.push(`COUNT(p.CODIGO_PEDIDO) = ${num}`);

        break;
      }

    }

  });

  const whereSQL = whereConditions.length
    ? " AND " + whereConditions.join(" AND ")
    : "";

  const havingSQL = havingConditions.length
    ? " HAVING " + havingConditions.join(" AND ")
    : "";

  return {
    where: whereSQL,
    having: havingSQL
  };
}