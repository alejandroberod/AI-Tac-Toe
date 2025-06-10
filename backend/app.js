import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
dotenv.config();

const allowedDomains = ["http://localhost:5175"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1) {
      //Domain is allowed
      callback(null, true);
    } else {
      callback(new Error("Not allowed for cors"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function boardToString(b) {
  return b
    .map((row) =>
      row
        .map((cell) => (cell === "X" ? "X" : cell === "O" ? "O" : "."))
        .join(" ")
    )
    .join("\n");
}

app.post("/api/ai-tac-toe", async (req, res) => {
  const { board, lang } = req.body;

  const messages = [
    {
      role: "system",
      content:
        `
      Eres un experto invencible en Tic-Tac-Toe. Juegas siempre como 'O' y tu salida debe ser SIEMPRE un JSON válido: { "row": number, "col": number }

      Reglas y orden de prioridades:
      1. Nunca permitas que 'X' gane:
        1.1 Comprueba primero todas las diagonales  
        1.2 Luego revisa todas las filas y columnas  
      2. Si tú puedes ganar en este movimiento, hazlo  
      3. Si no, bloquea cualquier amenaza inmediata de 'X'  
      4. Si no hay amenazas, elige la posición más estratégica: Centro > Esquinas > Laterales  
      5. Solo puedes jugar en celdas vacías, marcadas con “.”  
      6. El tablero es una matriz 3x3 con índices [0][0] a [2][2].

      Ejemplos de comportamiento:

      Ejemplo 1: Debes bloquear a 'X'  
      Tablero:  
      [X, X, .,  
      O, ., .,  
      ., ., .]  
      'X' amenaza con ganar en (0,2).  
      Respuesta esperada: { "row": 0, "col": 2 }

      Ejemplo 2: Puedes ganar tú mismo  
      Tablero:  
      [O, X, O,  
      X, O, .,  
      X, ., .]  
      'O' puede completar diagonal en (2,2).  
      Respuesta esperada: { "row": 2, "col": 2 }

      Ejemplo 3: Ninguna amenaza, toma posición estratégica  
      Tablero:  
      [X, ., .,  
      ., ., .,  
      ., ., .]  
      Centro libre → (1,1).  
      Respuesta esperada: { "row": 1, "col": 1 }

      Ejemplo 3: Gran amenaza, toma posición estratégica  
      Tablero:  
      [X, ., .,  
      ., O, .,  
      ., ., X] 
      Respuesta esperada: { "row": 1, "col": 2 }

      Ejemplo 4: Elegir esquina si centro y bloqueo no aplican  
      Tablero:  
      [O, X, O,  
      X, X, O,  
      O, ., .]  
      No hay amenaza y el centro está ocupado. Esquinas libres → (2,2).  
      Respuesta esperada: { "row": 2, "col": 2 }

      Ahora, dado cualquier tablero nuevo, responde SOLO con el JSON de la jugada óptima.
    `,
    },
    {
      role: "user",
      content: `Tablero actual ( . = vacío): ${boardToString(board)}`,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "o4-mini",
      messages,
    });
    const { row, col } = JSON.parse(response.choices[0].message.content);
    return res.status(200).json({row, col});
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
