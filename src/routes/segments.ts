import { Router } from "express";
import { connectDB } from "../db";
import { buildSegmentSQL } from "../services/buildSegmentSQL";

const router = Router();

router.post("/preview", async (req, res) => {
  const { filters } = req.body;

  const { where, having } = buildSegmentSQL(filters);

  const query = `SELECT
                c.CODIGO_CADASTRO_GERAL,
                c.NOME,
                c.CIDADE,
                c.TEL_CELULAR,
                MAX(p.DATA_PEDIDO) ULTIMA_COMPRA,
                COUNT(p.CODIGO_PEDIDO) TOTAL_COMPRAS

                FROM G_CADASTRO_GERAL c

                LEFT JOIN E_PEDIDO_VENDA_CAPA p
                ON p.CODIGO_CLIENTE = c.CODIGO_CADASTRO_GERAL

                WHERE c.CODIGO_TIPO='I'
                ${where}

                GROUP BY
                c.CODIGO_CADASTRO_GERAL,
                c.NOME,
                c.CIDADE,
                c.TEL_CELULAR

                ${having}
                `;

  console.log('query', query);


  try {

    const db = await connectDB();

    db.query(query, (err: any, result: any) => {

      db.detach();

      if (err) return res.status(500).json(err);

      res.json({
        count: result.length,
        data: result
      });

    });

  } catch (err) {

    res.status(500).json(err);

  }

});

export default router;