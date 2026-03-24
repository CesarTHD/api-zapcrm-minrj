import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/send", async (req, res) => {
    const { contacts, message, instance } = req.body;

    const serverUrl = process.env.EVOLUTION_URL;
    // const instance = process.env.EVOLUTION_INSTANCE;
    const apiKey = process.env.EVOLUTION_API_KEY;
    console.log('serverurl', serverUrl)
    console.log('instance', instance)
    console.log('apiKey', apiKey)
    try {
        for (const contact of contacts) {
            const phone = contact.TEL_CELULAR;
            const personalizedMessage = message.replace("{{NOME}}", contact.NOME).replace("{{CIDADE}}", contact.CIDADE).replace("{{ULTIMA_COMPRA}}", contact.ULTIMA_COMPRA).replace("{{TOTAL_COMPRAS}}", contact.TOTAL_COMPRA);
            const delay = Math.floor(Math.random() * 2000) + 1000;

            await axios.post(
                `${serverUrl}/message/sendText/${instance}`,
                {
                    number: phone,
                    text: personalizedMessage
                },
                {
                    headers: {
                        "apikey": apiKey,
                        "Content-Type": "application/json"
                    }
                }
            );

            // delay para evitar bloqueio do WhatsApp
            await new Promise(r => setTimeout(r, delay));
        }

        res.json({
            success: true,
            message: "Campanha enviada com sucesso"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Falha ao enviar campanha"
        });
    }
});

export default router;