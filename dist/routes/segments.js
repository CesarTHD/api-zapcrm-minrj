"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const buildSegmentSQL_1 = require("../services/buildSegmentSQL");
const router = (0, express_1.Router)();
router.post("/preview", async (req, res) => {
    console.log('teste');
    const { filters } = req.body;
    const havingSQL = (0, buildSegmentSQL_1.buildSegmentSQL)(filters);
    const { where, having } = (0, buildSegmentSQL_1.buildSegmentSQL)(filters);
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
        const db = await (0, db_1.connectDB)();
        db.query(query, (err, result) => {
            db.detach();
            if (err)
                return res.status(500).json(err);
            res.json({
                count: result.length,
                data: result
            });
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = router;
